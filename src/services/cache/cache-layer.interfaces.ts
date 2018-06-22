import { Metadata } from 'decorators/module/module.interfaces';

export interface CacheLayerItem<T> {
  key: string;
  data: T;
}

export class CacheServiceConfigInterface {
  deleteOnExpire?: string = 'aggressive';
  cacheFlushInterval?: number | null = 60 * 60 * 1000;
  maxAge?: number | null = 15 * 60 * 1000;
  localStorage?: boolean = false;
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
};
