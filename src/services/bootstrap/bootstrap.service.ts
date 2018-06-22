
import { of, combineLatest, from, Observable } from 'rxjs';
import { Container, Service, PluginInterface } from '../../container';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { CacheService } from '../cache/cache-layer.service';
import { InternalLayers, InternalEvents } from '../../helpers/events';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { ConfigService } from '../config/config.service';
import { PluginService } from '../plugin/plugin.service';
import { ConfigModel } from '../config/config.model';
import { take, map, switchMap } from 'rxjs/operators';
import { CacheLayer, CacheLayerItem } from '../cache';

@Service()
export class BootstrapService {

    globalConfig: CacheLayer<CacheLayerItem<ConfigModel>>;
    chainableObservable = of(true);
    asyncChainables: Observable<any>[] = [this.chainableObservable];

    constructor(
        private logger: BootstrapLogger,
        private cacheService: CacheService,
        private lazyFactoriesService: LazyFactory,
        private configService: ConfigService,
        private pluginService: PluginService
    ) {
        this.globalConfig = this.cacheService.createLayer<ConfigModel>({ name: InternalLayers.globalConfig });
    }

    public start(app, config?: ConfigModel): Observable<boolean> {
        this.configService.setConfig(config);
        this.globalConfig.putItem({ key: InternalEvents.init, data: config });
        Container.get(app);
        return of<string[]>(Array.from(this.lazyFactoriesService.lazyFactories.keys()))
            .pipe(
                map((i) => i.map(injectable => this.prepareAsyncChainables(injectable))),
                switchMap((res: Observable<Object>) => combineLatest(this.asyncChainables)
                    .pipe(
                        take(1),
                        map((c) => this.attachLazyLoadedChainables(res, c)),
                        map(() => this.validateSystem()),
                        switchMap(() => combineLatest(this.asyncChainablePluginsBeforeRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsAfterRegister())),
                        map((plugins) => this.loadApplication(plugins)),
                        map((p) => this.final(p))
                    ))
            );
    }

    private final(plugins) {
        // opn('https://theft.youvolio.com');
        // const globalConfig = cache.createLayer<{ init: boolean }>({ name: InternalLayers.globalConfig });
        // cache.getLayer('AppModule').putItem({key:InternalEvents.load, data: true});
        // cache.getLayer('UserModule').putItem({ key: InternalEvents.load, data: true });
        // console.log('bla bla', plugins);!
        // Bootstrapping finished!
        return true;
    }

    private asyncChainablePluginsRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getPlugins().map(async pluggable => this.registerPlugin(pluggable))
        ]
    }

    private async registerPlugin(pluggable: Function | PluginInterface) {
        const plugin = Container.get<PluginInterface>(pluggable);
        console.log(plugin);
        await plugin.register();
        return plugin;
    }

    private asyncChainablePluginsAfterRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getAfterPlugins().map(async pluggable => await this.registerPlugin(pluggable))
        ]
    }

    private asyncChainablePluginsBeforeRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getBeforePlugins().map(async pluggable => this.registerPlugin(pluggable))
        ]
    }

    private prepareAsyncChainables(injectable: any) {
        this.logger.log(`Bootstrap -> @Service('${injectable}'): loading...`);
        const somethingAsync = from(<Promise<any> | Observable<any>>this.lazyFactoriesService.getLazyFactory(injectable));
        this.asyncChainables.push(somethingAsync);
        somethingAsync
            .subscribe(
                () => this.logger.log(`Bootstrap -> @Service('${injectable}'): loading finished! ${new Date().toLocaleTimeString()}`)
            );
        return injectable;
    }

    private validateSystem() {
        this.cacheService.searchForDuplicateDependenciesInsideApp();
    }

    private attachLazyLoadedChainables(res, chainables) {
        chainables.splice(0, 1);
        let count = 0;
        res.forEach(name => {
            Container.set(name, chainables[count]);
            count++;
        });
        return true;
    }

    loadApplication(plugins) {
        this.logger.log('Bootstrap -> press start!');
        Array.from(this.cacheService.getLayer<Function>(InternalLayers.modules).map.keys())
            .forEach(m => this.cacheService.getLayer(m)
                .putItem({ key: InternalEvents.load, data: this.configService.config.init }));
        return plugins;
    }

}