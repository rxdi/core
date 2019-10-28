import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
import { ConstructorWatcherService } from '../constructor-watcher/constructor-watcher';
import { CacheLayer, CacheLayerItem } from '../../services/cache/';
export declare class ModuleService {
    watcherService: ConstructorWatcherService;
    private lazyFactoryService;
    private pluginService;
    private componentsService;
    private controllersService;
    private effectsService;
    private bootstraps;
    private validators;
    private servicesService;
    setServices(services: ServiceArgumentsInternal[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setInjectedDependencies(service: any): void;
    setUseValue(service: any): void;
    setUseClass(service: any): void;
    setUseDynamic(service: any): void;
    setUseFactory(service: any): void;
    setControllers(controllers: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setEffects(effects: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setComponents(components: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setPlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setBootstraps(bootstraps: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setAfterPlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setBeforePlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
    setImports(imports: Function[], original: ServiceArgumentsInternal): void;
}
