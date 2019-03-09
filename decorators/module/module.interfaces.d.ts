import { PluginInterface } from '../../container/decorators/Plugin';
import { ExternalImporterConfig } from '../../services/external-importer/external-importer-config';
import { InjectionToken } from '../../container/Token';
export interface ServiceArguments {
    name?: string;
    provide: string | InjectionToken<any> | Function;
    useValue?: any;
    useFactory?: Function;
    useClass?: any;
    metadata?: Metadata;
    useDynamic?: ExternalImporterConfig;
    deps?: Array<Function | InjectionToken<any>>;
    lazy?: boolean;
}
export interface ModuleWithServices {
    module?: Function;
    frameworkImports?: Array<Function | ModuleWithServices>;
    services?: Array<ServiceArguments | Function>;
    providers?: Array<ServiceArguments | Function>;
    controllers?: Array<Function | ModuleWithServices>;
    effects?: Array<Function>;
    components?: Array<Function>;
    beforePlugins?: Array<Function | PluginInterface>;
    plugins?: Array<Function | PluginInterface>;
    afterPlugins?: Array<Function | PluginInterface>;
}
export declare type DecoratorType = 'module' | 'service' | 'plugin' | 'controller' | 'effect' | 'component';
export declare type SystemIngridientsType = 'plugins' | 'pluginsBefore' | 'pluginsAfter' | 'controllers' | 'services' | 'effects' | 'components';
export interface Metadata {
    moduleHash?: string;
    moduleName?: string;
    raw?: string;
    type?: DecoratorType;
    options?: any;
}
export interface ServiceArgumentsInternal {
    name?: string;
    provide: Function | string | InjectionToken<any>;
    useValue?: any;
    useFactory?: Function;
    useClass?: any;
    metadata?: Metadata;
    useDynamic?: ExternalImporterConfig;
    deps?: Array<Function | string | InjectionToken<any>>;
    lazy?: boolean;
    originalName?: string;
    forRoot?: any;
}
export interface ModuleArguments<T, K> extends Metadata {
    imports?: Array<Function | ModuleWithServices>;
    services?: Array<Function | ServiceArgumentsInternal>;
    providers?: Array<Function | ServiceArgumentsInternal>;
    controllers?: Array<Function | ModuleWithServices>;
    effects?: Array<Function>;
    components?: Array<Function>;
    beforePlugins?: Array<T | PluginInterface>;
    plugins?: Array<T | PluginInterface>;
    afterPlugins?: Array<T | PluginInterface>;
    bootstrap?: Array<Function>;
}
