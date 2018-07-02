import { PluginService } from "../plugin/plugin.service";
import { PluginInterface } from "../../container";
export declare class PluginManager {
    private pluginService;
    constructor(pluginService: PluginService);
    listPlugins(): Array<Function | PluginInterface>;
    getPlugin(pluginClass: Function): Function | PluginInterface;
}
