import { InjectionToken } from "@rxdi/core";
import { PluginNameVersion, PluginBase, PluginPackage, ServerOptions } from 'hapi';

export class HapiConfigInterface  {
    randomPort?: boolean;
    hapi?: ServerOptions;
    plugins?: Array<PluginBase<any> & (PluginNameVersion | PluginPackage)>;

}

export const HAPI_CONFIG = new InjectionToken<HapiConfigInterface>('hapi-config-injection-token');
export const HAPI_SERVER = new InjectionToken<any>('hapi-server-injection-token');
export const HAPI_PLUGINS = new InjectionToken<Array<PluginBase<any> & (PluginNameVersion | PluginPackage)>>('hapi-plugins-injection-token');