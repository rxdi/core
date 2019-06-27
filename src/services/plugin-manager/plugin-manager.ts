import { PluginService } from '../plugin/plugin.service';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
import { Service } from '../../decorators/service/Service';

@Service()
export class PluginManager {
  constructor(private pluginService: PluginService) {}

  listPlugins(): Array<ServiceArgumentsInternal> {
    return this.pluginService.getPlugins();
  }

  getPlugin(pluginClass: Function): ServiceArgumentsInternal {
    return this.pluginService
      .getPlugins()
      .filter(p => p.name === pluginClass.name)[0];
  }
}
