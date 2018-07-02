import { Observable } from 'rxjs';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { CacheService } from '../cache/cache-layer.service';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { ConfigService } from '../config/config.service';
import { PluginService } from '../plugin/plugin.service';
import { ConfigModel } from '../config/config.model';
import { CacheLayer, CacheLayerItem } from '../cache';
import { EffectsService } from '../effect/effect.service';
import { ControllersService } from '../controllers/controllers.service';
import { ComponentsService } from '../components/components.service';
import { BootstrapsServices } from '../bootstraps/bootstraps.service';
import { ServicesService } from '../services/services.service';
import { PluginManager } from '../plugin-manager/plugin-manager';
export declare class BootstrapService {
    private logger;
    private cacheService;
    private lazyFactoriesService;
    configService: ConfigService;
    private controllersService;
    private effectsService;
    private pluginService;
    private componentsService;
    private bootstrapsService;
    private servicesService;
    private pluginManager;
    globalConfig: CacheLayer<CacheLayerItem<ConfigModel>>;
    chainableObservable: Observable<boolean>;
    asyncChainables: Observable<any>[];
    config: ConfigModel;
    constructor(logger: BootstrapLogger, cacheService: CacheService, lazyFactoriesService: LazyFactory, configService: ConfigService, controllersService: ControllersService, effectsService: EffectsService, pluginService: PluginService, componentsService: ComponentsService, bootstrapsService: BootstrapsServices, servicesService: ServicesService, pluginManager: PluginManager);
    start(app: any, config?: ConfigModel): Observable<PluginManager>;
    private final();
    private asyncChainablePluginsRegister();
    private asyncChainableComponents();
    private asyncChainableBootstraps();
    private asyncChainableEffects();
    private asyncChainableServices();
    private asyncChainableControllers();
    private asyncChainablePluginsAfterRegister();
    private asyncChainablePluginsBeforeRegister();
    private registerPlugin(pluggable);
    private prepareAsyncChainables(injectable);
    private validateSystem();
    private attachLazyLoadedChainables(res, chainables);
    loadApplication(): boolean;
}
