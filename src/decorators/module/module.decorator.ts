import { Container, ServiceMetadata } from '../../container';
import { CacheService } from '../../services/cache/cache-layer.service';
import { GenericConstruct } from '../../helpers/generic-constructor';
import { BootstrapLogger } from '../../services/bootstrap-logger/bootstrap-logger';
import { ResolverService } from '../../services/resolver/resolver.service';
import { ModuleArguments, ModuleWithServices } from '../module/module.interfaces';
import { MetadataService } from '../../services/metadata/metadata.service';
import { ModuleService } from '../../services/module/module.service';

const bootstrapLogger = Container.get(BootstrapLogger);
const resolverService = Container.get(ResolverService);
const cacheService = Container.get(CacheService);
const metadataService = Container.get(MetadataService);
const moduleService = Container.get(ModuleService);

export function Module<T, K extends keyof T>(module?: ModuleArguments<T, K>): Function {

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

        const currentModule = cacheService.createLayer<boolean>({ name: uniqueHashForClass });

        original['metadata'] = {
            moduleName: original['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'module',
            raw: uniqueModuleTemplate
        };

        const constructorFunction: any = function (...args) {
            bootstrapLogger.log(`Bootstrap -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loading...`);
            return GenericConstruct(module, original, currentModule)(original, args);
        };

        Object.assign(constructorFunction, original);

        resolverService.resolveDependencies(uniqueHashForClass, original, moduleName)
            .subscribe(
                () => bootstrapLogger.log(`Start -> @Module('${original.originalName}')${bootstrapLogger.logHashes(`(${original.name})`)}: loaded!`)
            );

        if (original.forRoot) {
            constructorFunction.forRoot = original.forRoot;
            const originalForRoot = constructorFunction.forRoot;
            constructorFunction.forRoot = function (args) {
                const result: ModuleWithServices = originalForRoot(args);
                if (!result.services) {
                    console.info(`Consider return ${original.name}; if you dont want to use ModuleWithServices interface to return Pre initialized configuration services`);
                    console.info(`Your Gapi module loaded as regular import please remove ${original.name}.forRoot() and instead import just ${original.name}`);
                } else {
                    moduleService.setServices(<any>result.services, original, currentModule);
                }

                if (result.beforePlugins) {
                    moduleService.setBeforePlugins(result.beforePlugins);
                }

                if (result.plugins) {
                    moduleService.setPlugins(result.plugins);
                }

                if (result.afterPlugins) {
                    moduleService.setAfterPlugins(result.afterPlugins);
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
