import { Observable } from 'rxjs';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { CacheService } from '../cache/cache-layer.service';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { ConfigService } from '../config/config.service';
import { PluginService } from '../plugin/plugin.service';
import { ConfigModel } from '../config/config.model';
import { CacheLayer, CacheLayerItem } from '../cache';
export declare class BootstrapService {
    private logger;
    private cacheService;
    private lazyFactoriesService;
    private configService;
    private pluginService;
    globalConfig: CacheLayer<CacheLayerItem<ConfigModel>>;
    chainableObservable: Observable<boolean>;
    asyncChainables: Observable<any>[];
    constructor(logger: BootstrapLogger, cacheService: CacheService, lazyFactoriesService: LazyFactory, configService: ConfigService, pluginService: PluginService);
    start(app: any, config?: ConfigModel): Observable<boolean>;
    private final(plugins);
    private asyncChainablePluginsRegister();
    private registerPlugin(pluggable);
    private asyncChainablePluginsAfterRegister();
    private asyncChainablePluginsBeforeRegister();
    private prepareAsyncChainables(injectable);
    private validateSystem();
    private attachLazyLoadedChainables(res, chainables);
    loadApplication(plugins: any): any;
}
