import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
export declare class ModuleService {
    private lazyFactoryService;
    private pluginService;
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
