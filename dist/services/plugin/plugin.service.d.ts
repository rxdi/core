import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
export declare class PluginService {
    private plugins;
    private beforePlugins;
    private afterPlugins;
    register(plugin: any): void;
    registerBefore(plugin: any): void;
    registerAfter(plugin: any): void;
    getPlugins(): Array<ServiceArgumentsInternal>;
    getAfterPlugins(): ServiceArgumentsInternal[];
    getBeforePlugins(): ServiceArgumentsInternal[];
}
