
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
import { BootstrapsServices } from '../bootstraps/bootstraps.service';
import { ServicesService } from '../services/services.service';

@Service()
export class BootstrapService {

    globalConfig: CacheLayer<CacheLayerItem<ConfigModel>>;
    chainableObservable = of(true);
    asyncChainables: Observable<any>[] = [this.chainableObservable];
    config: ConfigModel;
    constructor(
        private logger: BootstrapLogger,
        private cacheService: CacheService,
        private lazyFactoriesService: LazyFactory,
        private configService: ConfigService,
        private controllersService: ControllersService,
        private effectsService: EffectsService,
        private pluginService: PluginService,
        private componentsService: ComponentsService,
        private bootstrapsService: BootstrapsServices,
        private servicesService: ServicesService
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
                        switchMap(() => combineLatest(this.asyncChainableServices())),
                        switchMap(() => combineLatest(this.asyncChainableControllers())),
                        switchMap(() => combineLatest(this.asyncChainableEffects())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsBeforeRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsAfterRegister())),
                        switchMap(() => combineLatest(this.asyncChainableComponents())),
                        map(() => this.loadApplication()),
                        switchMap(() => combineLatest(this.asyncChainableBootstraps())),
                        map(() => this.final())
                    ))
            );
    }

    private final() {
        // opn('https://theft.youvolio.com');
        // const globalConfig = cache.createLayer<{ init: boolean }>({ name: InternalLayers.globalConfig });
        // cache.getLayer('AppModule').putItem({key:InternalEvents.load, data: true});
        // cache.getLayer('UserModule').putItem({ key: InternalEvents.load, data: true });
        // console.log('bla bla', plugins);!
        // Bootstrapping finished!
        return true;
    }

    private asyncChainablePluginsRegister() {
        const filter = (c) => this.configService.config.initOptions.plugins
            || this.configService.config.init
            || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.pluginService.getPlugins()
                .filter(filter)
                .map(async c => this.registerPlugin(c))
        ]
    }

    private asyncChainableComponents() {
        const filter = (c) => this.configService.config.initOptions.components
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.componentsService.getComponents()
                .filter(filter)
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
        const filter = (c) => this.configService.config.initOptions.effects
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.effectsService.getEffects()
                .filter(filter)
                .map(async c => await Container.get(c))
        ]
    }

    private asyncChainableServices() {
        const filter = (c) => this.configService.config.initOptions.services
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.servicesService.getServices()
                .filter(filter)
                .map(async c => await Container.get(c))
        ]
    }

    private asyncChainableControllers() {
        const filter = (c) => this.configService.config.initOptions.controllers
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.controllersService.getControllers()
                .filter(filter)
                .map(async c => await Container.get(c))
        ]
    }

    private async registerPlugin(pluggable: Function | PluginInterface) {
        const plugin = Container.get<PluginInterface>(pluggable);
        await plugin.register();
        return plugin;
    }

    private asyncChainablePluginsAfterRegister() {
        const filter = (c) => this.configService.config.initOptions.pluginsAfter
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.pluginService.getAfterPlugins()
                .filter(filter)
                .map(async c => await this.registerPlugin(c))
        ]
    }

    private asyncChainablePluginsBeforeRegister() {
        const filter = (c) => this.configService.config.initOptions.pluginsBefore
        || this.configService.config.init
        || c['metadata']['options'] && c['metadata']['options']['init'];
        return [
            this.chainableObservable,
            ...this.pluginService.getBeforePlugins()
                .filter(filter)
                .map(async c => this.registerPlugin(c))
        ]
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

    loadApplication() {
        this.logger.log('Bootstrap -> press start!');
        Array.from(this.cacheService.getLayer<Function>(InternalLayers.modules).map.keys())
            .forEach(m => this.cacheService.getLayer(m)
                .putItem({ key: InternalEvents.load, data: this.configService.config.init }));
        return true;
    }

}