import { BehaviorSubject, Observable } from 'rxjs';
import { CacheLayer } from './cache-layer';
import { CacheLayerItem, CacheLayerInterface, Duplicates } from './cache-layer.interfaces';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
import { BootstrapLogger } from '../bootstrap-logger/index';
export declare class CacheService {
    private logger;
    constructor(logger: BootstrapLogger);
    _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    map: Map<any, any>;
    config: any;
    static createCacheInstance<T>(cacheLayer: any): CacheLayer<CacheLayerItem<T>>;
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    getLayersByName<T>(name: string): CacheLayer<CacheLayerItem<T>>[];
    searchForDuplicateDependenciesInsideApp(): string[];
    private isExcludedEvent;
    searchForItem(classItem: Function): ServiceArgumentsInternal;
    searchForDuplicatesByHash(key: string): Duplicates[];
    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    private LayerHook;
    private protectLayerFromInvaders;
    private OnExpire;
    removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void;
    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[];
    flushCache(): Observable<boolean>;
}
