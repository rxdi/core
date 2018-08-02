import { CacheLayerInterface, CacheServiceConfigInterface } from './cache-layer.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
export declare class CacheLayer<T> {
    items: BehaviorSubject<Array<T>>;
    name: string;
    config: CacheServiceConfigInterface;
    map: Map<any, any>;
    get(name: any): T;
    constructor(layer: CacheLayerInterface);
    private initHook;
    private onExpireAll;
    private putItemHook;
    getItem(key: string): T;
    putItem(layerItem: T): T;
    private onExpire;
    removeItem(key: string): void;
    getItemObservable(key: string): Observable<T>;
    flushCache(): Observable<boolean>;
}
