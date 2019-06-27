import { BehaviorSubject } from 'rxjs';
// import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
import { Service } from '../../decorators/service/Service';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class PluginService {
  private plugins: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);
  private beforePlugins: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);
  private afterPlugins: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);

  register(plugin) {
    this.plugins.next([...this.plugins.getValue(), plugin]);
  }

  registerBefore(plugin) {
    this.beforePlugins.next([...this.plugins.getValue(), plugin]);
  }

  registerAfter(plugin) {
    this.afterPlugins.next([...this.plugins.getValue(), plugin]);
  }

  getPlugins(): Array<ServiceArgumentsInternal> {
    return this.plugins.getValue();
  }

  getAfterPlugins() {
    return this.afterPlugins.getValue();
  }

  getBeforePlugins() {
    return this.beforePlugins.getValue();
  }
}
