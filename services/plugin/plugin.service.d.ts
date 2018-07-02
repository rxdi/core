import { PluginInterface } from '../../container';
export declare class PluginService {
    private plugins;
    private beforePlugins;
    private afterPlugins;
    register(plugin: any): void;
    registerBefore(plugin: any): void;
    registerAfter(plugin: any): void;
    getPlugins(): Array<Function | PluginInterface>;
    getAfterPlugins(): (Function | PluginInterface)[];
    getBeforePlugins(): (Function | PluginInterface)[];
}
