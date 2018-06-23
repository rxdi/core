import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
export declare class ModuleService {
    private lazyFactoryService;
    private pluginService;
    private externalImporter;
    setServices(services: ServiceArgumentsInternal[], original: {
        metadata: Metadata;
    }, currentModule: any): void;
    setPlugins(plugins: any, currentModule: any): void;
    setAfterPlugins(plugins: any): void;
    setBeforePlugins(plugins: any): void;
    validateImports(m: any, original: {
        metadata: Metadata;
    }): void;
    validateServices(m: any, original: {
        metadata: Metadata;
    }): void;
    setImports(module: any, original: {
        metadata: Metadata;
    }): void;
}
