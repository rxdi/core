
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
import { CacheLayer, CacheLayerItem } from '../cache/index';
import { EffectsService } from '../effect/effect.service';
import { ControllersService } from '../controllers/controllers.service';
import { ComponentsService } from '../components/components.service';
import { BootstrapsServices } from '../bootstraps/bootstraps.service';
import { ServicesService } from '../services/services.service';
import { PluginManager } from '../plugin-manager/plugin-manager';
import { AfterStarterService } from '../after-starter/after-starter.service';
import { ServiceArgumentsInternal, SystemIngridientsType } from '../../decorators/module/module.interfaces';


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
        public configService: ConfigService,
        private controllersService: ControllersService,
        private effectsService: EffectsService,
        private pluginService: PluginService,
        private componentsService: ComponentsService,
        private bootstrapsService: BootstrapsServices,
        private servicesService: ServicesService,
        private pluginManager: PluginManager,
        private afterStarterService: AfterStarterService
    ) {
        this.globalConfig = this.cacheService.createLayer<ConfigModel>({ name: InternalLayers.globalConfig });
    }

    public start(app, config?: ConfigModel) {
        this.configService.setConfig(config);
        this.globalConfig.putItem({ key: InternalEvents.init, data: config });
        Container.get(app);
        const lazyFactoryKeys = Array.from(this.lazyFactoriesService.lazyFactories.keys());
        return of<string[]>(lazyFactoryKeys)
            .pipe(
                map((factories) => this.prepareAsyncChainables(factories)),
                switchMap((res) => combineLatest(res)
                    .pipe(
                        take(1),
                        map((c) => this.attachLazyLoadedChainables(lazyFactoryKeys, c)),
                        map(() => this.validateSystem()),
                        switchMap(() => combineLatest(this.asyncChainableControllers())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsBeforeRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsRegister())),
                        switchMap(() => combineLatest(this.asyncChainablePluginsAfterRegister())),
                        switchMap(() => combineLatest(this.asyncChainableServices())),
                        switchMap(() => combineLatest(this.asyncChainableEffects())),
                        switchMap(() => combineLatest(this.asyncChainableComponents())),
                        map(() => this.loadApplication()),
                        switchMap(() => combineLatest(this.asyncChainableBootstraps())),
                        map(() => this.final())
                    ))
            );
    }

    private final(): Container {
        // opn('https://theft.youvolio.com');
        // const globalConfig = cache.createLayer<{ init: boolean }>({ name: InternalLayers.globalConfig });
        // cache.getLayer('AppModule').putItem({key:InternalEvents.load, data: true});
        // cache.getLayer('UserModule').putItem({ key: InternalEvents.load, data: true });
        // console.log('bla bla', plugins);!
        // Bootstrapping finished!
        this.afterStarterService.appStarted.next(true);
        return Container;
    }

    private asyncChainablePluginsRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getPlugins()
            .filter((c) => this.genericFilter(c, 'plugins'))
                .map(async c => this.registerPlugin(c))
        ];
    }

    private asyncChainableComponents() {
        return [
            this.chainableObservable,
            ...this.componentsService.getComponents()
                .filter((c) => this.genericFilter(c, 'components'))
                .map(async c => await Container.get(c))
        ];
    }

    private asyncChainableBootstraps() {
        return [
            this.chainableObservable,
            ...this.bootstrapsService.getBootstraps()
                .map(async c => await Container.get(c))
        ];
    }

    private asyncChainableEffects() {
        return [
            this.chainableObservable,
            ...this.effectsService.getEffects()
                .filter((c) => this.genericFilter(c, 'effects'))
                .map(async c => await Container.get(c))
        ];
    }

    private asyncChainableServices() {
        return [
            this.chainableObservable,
            ...this.servicesService.getServices()
                .filter((c) => this.genericFilter(c, 'services'))
                .map(async c => await Container.get(c))
        ];
    }

    private asyncChainableControllers() {
        return [
            this.chainableObservable,
            ...this.controllersService.getControllers()
                .filter((c) => this.genericFilter(c, 'controllers'))
                .map(async c => await Container.get(c))
        ];
    }



    private asyncChainablePluginsAfterRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getAfterPlugins()
                .filter((c) => this.genericFilter(c, 'pluginsAfter'))
                .map(async c => await this.registerPlugin(c))
        ];
    }

    private asyncChainablePluginsBeforeRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getBeforePlugins()
                .filter((c) => this.genericFilter(c, 'pluginsBefore'))
                .map(async c => this.registerPlugin(c))
        ];
    }

    private genericFilter(c: ServiceArgumentsInternal, name: SystemIngridientsType) {
        return this.configService.config.initOptions[name]
            || c.metadata.options && c.metadata.options['init']
            || this.configService.config.init;
    }


    private async registerPlugin(pluggable: ServiceArgumentsInternal) {
        const plugin = Container.get<PluginInterface>(pluggable);
        await plugin.register();
        return plugin;
    }

    private prepareAsyncChainables(injectables: any[]) {
        const asynChainables = [this.chainableObservable];
        injectables.map(injectable => {
            this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading...`);
            asynChainables.push(from(<Promise<any> | Observable<any>>this.lazyFactoriesService.getLazyFactory(injectable)));
        });
        // somethingAsync
        //     .subscribe(
        //         () => this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading finished! ${new Date().toLocaleTimeString()}`)
        //     );
        return asynChainables;
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