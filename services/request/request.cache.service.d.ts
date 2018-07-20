import { CacheService, CacheLayer, CacheLayerItem } from '../cache';
export declare class RequestCacheService extends CacheService {
    cacheLayer: CacheLayer<CacheLayerItem<any>>;
    constructor();
    put(key: any, data: any): CacheLayerItem<any>;
    get(key: any): CacheLayerItem<any>;
}
