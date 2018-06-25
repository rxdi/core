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
    afterPlugins?: Array<Function | PluginInterface>;
    plugins?: Array<Function | PluginInterface>;
    beforePlugins?: Array<Function | PluginInterface>;
    services?: Array<ServiceArguments | Function>;
}
export declare type DecoratorType = 'module' | 'service' | 'plugin' | 'controller' | 'effect';
export interface Metadata {
    moduleHash?: string;
    moduleName?: string;
    raw?: string;
    type?: DecoratorType;
}
export interface ServiceArgumentsInternal {
    name?: string;
    provide: Function | string | InjectionToken<any>;
    useValue?: any;
    useFactory?: Function;
    useClass?: any;
    metadata?: Metadata;
    useDynamic?: ExternalImporterConfig;
    deps?: Array<Function>;
    lazy?: boolean;
}
export interface ModuleArguments<T, K> extends Metadata {
    imports?: Array<Function | ModuleWithServices | T>;
    services?: Array<Function | ServiceArgumentsInternal>;
    controllers?: Array<Function | ModuleWithServices | T>;
    effects?: Array<T>;
    afterPlugins?: Array<T | PluginInterface>;
    beforePlugins?: Array<T | PluginInterface>;
    plugins?: Array<T | PluginInterface>;
}
