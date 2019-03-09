"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const cache_layer_service_1 = require("../../services/cache/cache-layer.service");
const generic_constructor_1 = require("../../helpers/generic-constructor");
const bootstrap_logger_1 = require("../../services/bootstrap-logger/bootstrap-logger");
const resolver_service_1 = require("../../services/resolver/resolver.service");
const metadata_service_1 = require("../../services/metadata/metadata.service");
const module_service_1 = require("../../services/module/module.service");
const bootstrapLogger = container_1.Container.get(bootstrap_logger_1.BootstrapLogger);
const resolverService = container_1.Container.get(resolver_service_1.ResolverService);
const cacheService = container_1.Container.get(cache_layer_service_1.CacheService);
const metadataService = container_1.Container.get(metadata_service_1.MetadataService);
const moduleService = container_1.Container.get(module_service_1.ModuleService);
function Module(module) {
    return (target) => {
        module = module || {};
        const original = Object.assign(target);
        const moduleName = target.name || target.constructor.name;
        const generatedHashData = metadataService.generateHashData(module, original);
        const uniqueModuleTemplate = metadataService.parseModuleTemplate(moduleName, generatedHashData, `${target}`);
        const uniqueHashForClass = metadataService.createUniqueHash(uniqueModuleTemplate);
        // console.log(`--------- ${moduleName} --------- Hash: ${uniqueHashForClass}---------`);
        // console.log(uniqueModuleTemplate);
        Object.defineProperty(original, 'originalName', { value: original.name || original.constructor.name, writable: false });
        Object.defineProperty(original, 'name', { value: uniqueHashForClass, writable: true });
        const currentModuleLayer = cacheService.createLayer({ name: uniqueHashForClass });
        original.metadata = {
            moduleName: original.originalName,
            moduleHash: uniqueHashForClass,
            options: null,
            type: 'module',
            raw: uniqueModuleTemplate
        };
        const constructorFunction = function (...args) {
            bootstrapLogger.log(`Bootstrap -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loading...`);
            return generic_constructor_1.GenericConstruct(module, original, currentModuleLayer)(original, args);
        };
        Object.assign(constructorFunction, original);
        resolverService.resolveDependencies(uniqueHashForClass, original, moduleName)
            .subscribe(() => bootstrapLogger.log(`Start -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loaded!`));
        Object.getOwnPropertyNames(original)
            .filter(prop => typeof original[prop] === 'function')
            .map(descriptor => Object.defineProperty(constructorFunction, descriptor, {
            configurable: true,
            writable: true,
            value: original[descriptor]
        }));
        if (original.forRoot) {
            const originalForRoot = constructorFunction.forRoot;
            constructorFunction.forRoot = function (args) {
                const result = originalForRoot(args);
                if (!result) {
                    throw new Error(`forRoot configuration inside ${constructorFunction.name} is returning undefined or null`);
                }
                if (result.frameworkImports) {
                    moduleService.setImports(result.frameworkImports, original);
                }
                if (result.services) {
                    moduleService.setServices(result.services, original, currentModuleLayer);
                }
                if (result.providers) {
                    moduleService.setServices(result.providers, original, currentModuleLayer);
                }
                if (result.components) {
                    moduleService.setComponents(result.components, original, currentModuleLayer);
                }
                if (result.effects) {
                    moduleService.setEffects(result.effects, original, currentModuleLayer);
                }
                if (result.controllers) {
                    moduleService.setControllers(result.controllers, original, currentModuleLayer);
                }
                if (result.beforePlugins) {
                    moduleService.setBeforePlugins(result.beforePlugins, original, currentModuleLayer);
                }
                if (result.plugins) {
                    moduleService.setPlugins(result.plugins, original, currentModuleLayer);
                }
                if (result.afterPlugins) {
                    moduleService.setAfterPlugins(result.afterPlugins, original, currentModuleLayer);
                }
                return result.module ? result.module : result;
            };
        }
        const service = {
            type: constructorFunction
        };
        container_1.Container.set(service);
        return constructorFunction;
    };
}
exports.Module = Module;
