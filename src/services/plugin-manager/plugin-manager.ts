import { PluginService } from '../plugin/plugin.service';
import { Service, PluginInterface } from '../../container/index';

@Service()
export class PluginManager {

    constructor(
        private pluginService: PluginService
    ) {}

    listPlugins(): Array<Function | PluginInterface> {
        return this.pluginService.getPlugins();
    }

    getPlugin(pluginClass: Function): Function | PluginInterface {
        return this.pluginService.getPlugins().filter(p => p.name === pluginClass.name)[0];
    }

}