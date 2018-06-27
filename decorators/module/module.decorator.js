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
        const currentModule = cacheService.createLayer({ name: uniqueHashForClass });
        original['metadata'] = {
            moduleName: original['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'module',
            raw: uniqueModuleTemplate
        };
        const constructorFunction = function (...args) {
            bootstrapLogger.log(`Bootstrap -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loading...`);
            return generic_constructor_1.GenericConstruct(module, original, currentModule)(original, args);
        };
        Object.assign(constructorFunction, original);
        resolverService.resolveDependencies(uniqueHashForClass, original, moduleName)
            .subscribe(() => bootstrapLogger.log(`Start -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loaded!`));
        if (original.forRoot) {
            constructorFunction.forRoot = original.forRoot;
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
                    moduleService.setServices(result.services, original, currentModule);
                }
                if (result.beforePlugins) {
                    moduleService.setBeforePlugins(result.beforePlugins, original, currentModule);
                }
                if (result.plugins) {
                    moduleService.setPlugins(result.plugins, original, currentModule);
                }
                if (result.afterPlugins) {
                    moduleService.setAfterPlugins(result.afterPlugins, original, currentModule);
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
