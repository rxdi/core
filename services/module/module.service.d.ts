import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
import { ConstructorWatcherService } from '../constructor-watcher/constructor-watcher';
export declare class ModuleService {
    watcherService: ConstructorWatcherService;
    private lazyFactoryService;
    private pluginService;
    private controllersService;
    private effectsService;
    private externalImporter;
    private validators;
    setServices(services: ServiceArgumentsInternal[], original: {
        metadata: Metadata;
    }, currentModule: any): void;
    setInjectedDependencies(service: any): void;
    setUseValue(service: any): void;
    setUseClass(service: any): void;
    setUseDynamic(service: any): void;
    setUseFactory(service: any): void;
    setControllers(controllers: any[], original: any, currentModule: any): void;
    setEffects(effects: any[], original: any, currentModule: any): void;
    setPlugins(plugins: any, original: {
        metadata: Metadata;
    }, currentModule: any): void;
    setAfterPlugins(plugins: any, original: {
        metadata: Metadata;
    }, currentModule: any): void;
    setBeforePlugins(plugins: any, original: {
        metadata: Metadata;
    }, currentModule: any): void;
    setImports(module: any, original: {
        metadata: Metadata;
    }): void;
}
