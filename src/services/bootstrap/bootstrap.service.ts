
import { of, combineLatest, from, Observable, forkJoin } from 'rxjs';
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
import { EffectsService } from '../effect/effect.service';
import { ControllersService } from '../controllers/controllers.service';
import { ComponentsService } from '../components/components.service';
import { BootstrapsServices } from '../bootstraps';

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
        private controllersService: ControllersService,
        private effectsService: EffectsService,
        private pluginService: PluginService,
        private componentsService: ComponentsService,
        private bootstrapsService: BootstrapsServices
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
                        switchMap(() => combineLatest(this.asyncChainableControllers())),
                        switchMap(() => combineLatest(this.asyncChainableEffects())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsBeforeRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsAfterRegister())),
                        switchMap(() => combineLatest(this.asyncChainableComponents())),
                        switchMap(() => combineLatest(this.asyncChainableBootstraps())),
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
            ...this.pluginService.getPlugins()
            .filter(this.filterInit())
            .map(async pluggable => this.registerPlugin(pluggable))
        ]
    }

    private asyncChainableComponents() {
        return [
            this.chainableObservable,
            ...this.componentsService.getComponents()
            .filter(this.filterInit())
            .map(async c => await Container.get(c))
        ]
    }

    private asyncChainableBootstraps() {
        return [
            this.chainableObservable,
            ...this.bootstrapsService.getBootstraps()
            .map(async c => await Container.get(c))
        ]
    }

    private asyncChainableEffects() {
        return [
            this.chainableObservable,
            ...this.effectsService.getEffects()
            .filter(this.filterInit())
            .map(async effect => await Container.get(effect))
        ]
    }

    private asyncChainableControllers() {
        return [
            this.chainableObservable,
            ...this.controllersService.getControllers()
            .filter(this.filterInit())
            .map(async controller => await Container.get(controller))
        ]
    }

    private async registerPlugin(pluggable: Function | PluginInterface) {
        const plugin = Container.get<PluginInterface>(pluggable);
        await plugin.register();
        return plugin;
    }

    private asyncChainablePluginsAfterRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getAfterPlugins()
            .filter(this.filterInit())
            .map(async pluggable => await this.registerPlugin(pluggable))
        ]
    }

    private asyncChainablePluginsBeforeRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getBeforePlugins()
            .filter(this.filterInit())
            .map(async pluggable => this.registerPlugin(pluggable))
        ]
    }

    filterInit() {
        return (c) => c['metadata']['options'] && c['metadata']['options']['init'];
    }

    private prepareAsyncChainables(injectable: any) {
        this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading...`);
        const somethingAsync = from(<Promise<any> | Observable<any>>this.lazyFactoriesService.getLazyFactory(injectable));
        this.asyncChainables.push(somethingAsync);
        // somethingAsync
        //     .subscribe(
        //         () => this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading finished! ${new Date().toLocaleTimeString()}`)
        //     );
        return injectable;
    }

    private validateSystem() {
        this.cacheService.searchForDuplicateDependenciesInsideApp();
    }

    private attachLazyLoadedChainables(res, chainables) {
        // Remove first chainable unused observable
        chainables.splice(0, 1);
        let count = 0;
        res.map(name => Container.set(name, chainables[count++]));
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