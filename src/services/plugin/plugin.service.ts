import { BehaviorSubject } from 'rxjs';
// import { PluginBase, PluginNameVersion, PluginPackage } from 'hapi';
import { Service, PluginInterface } from '../../container';

@Service()
export class PluginService {

    private plugins: BehaviorSubject<Array<PluginInterface>> = new BehaviorSubject([]);
    private beforePlugins: BehaviorSubject<Array<Function | PluginInterface>> = new BehaviorSubject([]);
    private afterPlugins: BehaviorSubject<Array<Function | PluginInterface>> = new BehaviorSubject([]);

    register(plugin) {
        this.plugins.next([...this.plugins.getValue(), plugin]);
    }

    registerBefore(plugin) {
        this.beforePlugins.next([...this.plugins.getValue(), plugin]);
    }

    registerAfter(plugin) {
        this.afterPlugins.next([...this.plugins.getValue(), plugin]);
    }

    getPlugins(): Array<Function | PluginInterface> {
        return this.plugins.getValue();
    }

    getAfterPlugins() {
        return this.afterPlugins.getValue();
    }

    getBeforePlugins() {
        return this.beforePlugins.getValue();
    }

}