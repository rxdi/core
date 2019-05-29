import { Container, ServiceMetadata } from '../../container';
import { CacheService } from '../../services/cache/cache-layer.service';
import { GenericConstruct } from '../../helpers/generic-constructor';
import { BootstrapLogger } from '../../services/bootstrap-logger/bootstrap-logger';
import { ResolverService } from '../../services/resolver/resolver.service';
import { ModuleArguments, ModuleWithServices, ServiceArgumentsInternal } from '../module/module.interfaces';
import { MetadataService } from '../../services/metadata/metadata.service';
import { ModuleService } from '../../services/module/module.service';

const bootstrapLogger = Container.get(BootstrapLogger);
const resolverService = Container.get(ResolverService);
const cacheService = Container.get(CacheService);
const metadataService = Container.get(MetadataService);
const moduleService = Container.get(ModuleService);

export function Module<T, K extends keyof T>(module?: ModuleArguments<T, K>): Function {
    return (target: any) => {
        module = module || {};
        const original: ServiceArgumentsInternal = Object.assign(target);
        const moduleName = target.name || target.constructor.name;
        const generatedHashData = metadataService.generateHashData(module, original);
        const uniqueModuleTemplate = metadataService.parseModuleTemplate(moduleName, generatedHashData, `${target}`);
        const uniqueHashForClass = metadataService.createUniqueHash(uniqueModuleTemplate);

        // console.log(`--------- ${moduleName} --------- Hash: ${uniqueHashForClass}---------`);
        // console.log(uniqueModuleTemplate);

        Object.defineProperty(original, 'originalName', { value: original.name || original.constructor.name, writable: false });
        Object.defineProperty(original, 'name', { value: uniqueHashForClass, writable: true });

        const currentModuleLayer = cacheService.createLayer<Function>({ name: uniqueHashForClass });

        original.metadata = {
            moduleName: original.originalName,
            moduleHash: uniqueHashForClass,
            options: null,
            type: 'module',
            raw: uniqueModuleTemplate
        };

        const constructorFunction: any = function (...args: any[]) {
            bootstrapLogger.log(`Bootstrap -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loading...`);
            return GenericConstruct(module, original, currentModuleLayer)(original, args);
        };

        Object.assign(constructorFunction, original);

        resolverService.resolveDependencies(uniqueHashForClass, original, moduleName)
            .subscribe(
                () => bootstrapLogger.log(`Start -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loaded!`)
            );

        Object.getOwnPropertyNames(original)
            .filter(prop => typeof original[prop] === 'function')
            .map(descriptor => Object.defineProperty(constructorFunction, descriptor, {
                configurable: true,
                writable: true,
                value: original[descriptor]
            }));
        if (original.forRoot) {
            const originalForRoot = constructorFunction.forRoot;
            constructorFunction.forRoot = function (...args: any) {
                const result: ModuleWithServices = originalForRoot(...args);

                if (!result) {
                    throw new Error(`forRoot configuration inside ${constructorFunction.name} is returning undefined or null`);
                }

                if (result.frameworkImports) {
                    moduleService.setImports(result.frameworkImports as any, original);
                }

                if (result.services) {
                    moduleService.setServices(result.services as any, original, currentModuleLayer);
                }

                if (result.providers) {
                    moduleService.setServices(result.providers as any, original, currentModuleLayer);
                }

                if (result.components) {
                    moduleService.setComponents(result.components as any, original, currentModuleLayer);
                }

                if (result.effects) {
                    moduleService.setEffects(result.effects as any, original, currentModuleLayer);
                }

                if (result.controllers) {
                    moduleService.setControllers(result.controllers as any, original, currentModuleLayer);
                }

                if (result.beforePlugins) {
                    moduleService.setBeforePlugins(result.beforePlugins as any, original, currentModuleLayer);
                }

                if (result.plugins) {
                    moduleService.setPlugins(result.plugins as any, original, currentModuleLayer);
                }

                if (result.afterPlugins) {
                    moduleService.setAfterPlugins(result.afterPlugins as any, original, currentModuleLayer);
                }

                /** @angular compatability */
                if (result.ngModule) {
                    return result.ngModule;
                }

                return result.module ? result.module : result;
            };
        }

        const service: ServiceMetadata<T, K> = {
            type: constructorFunction
        };

        Container.set(service);
        return constructorFunction;
    };
}

/** @angular module compatability */
export const NgModule = Module;