import { PluginService } from '../plugin/plugin.service';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
export declare class PluginManager {
    private pluginService;
    constructor(pluginService: PluginService);
    listPlugins(): Array<ServiceArgumentsInternal>;
    getPlugin(pluginClass: Function): ServiceArgumentsInternal;
}
