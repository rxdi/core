import { Metadata } from '../../decorators/module/module.interfaces';
export interface CacheLayerItem<T> {
    key: string;
    data: T;
}
export declare class CacheServiceConfigInterface {
    deleteOnExpire?: string;
    cacheFlushInterval?: number | null;
    maxAge?: number | null;
    localStorage?: boolean;
}
export interface CacheLayerInterface {
    name: string;
    config?: CacheServiceConfigInterface;
    items?: any;
}
export interface Duplicates extends Metadata {
    dupeName: string;
    originalName: string;
    class: Function;
}
