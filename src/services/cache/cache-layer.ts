import {
  CacheLayerInterface,
  CacheServiceConfigInterface
} from './cache-layer.interfaces';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, timeoutWith, skip, take } from 'rxjs/operators';

export class CacheLayer<T> {
  public items: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public name: string;
  public config: CacheServiceConfigInterface;
  public map: Map<any, any> = new Map();

  public get(name): T {
    return this.map.get(name);
  }

  constructor(layer: CacheLayerInterface) {
    this.name = layer.name;
    this.config = layer.config;
    this.initHook(layer);
  }

  private initHook(layer) {
    if (this.config.maxAge) {
      this.onExpireAll(layer);
    }
  }

  private onExpireAll(layer) {
    layer.items.forEach(item => this.onExpire(item['key']));
  }

  private putItemHook(layerItem): void {
    if (this.config.maxAge) {
      this.onExpire(layerItem['key']);
    }
  }

  public getItem(key: string): T {
    if (this.map.has(key)) {
      return this.get(key);
    } else {
      return null;
    }
  }

  public putItem(layerItem: T): T {
    this.map.set(layerItem['key'], layerItem);
    const item = this.get(layerItem['key']);
    const filteredItems = this.items
      .getValue()
      .filter(item => item['key'] !== layerItem['key']);
    this.items.next([...filteredItems, item]);
    this.putItemHook(layerItem);
    return layerItem;
  }

  private onExpire(key: string) {
    return new Observable(observer => observer.next())
      .pipe(
        timeoutWith(this.config.maxAge, of(1)),
        skip(1),
        take(1)
      )
      .subscribe(() => this.removeItem(key));
  }

  public removeItem(key: string): void {
    const newLayerItems = this.items
      .getValue()
      .filter(item => item['key'] !== key);
    this.map.delete(key);
    this.items.next(newLayerItems);
  }

  public getItemObservable(key: string): Observable<T> {
    return this.items.asObservable().pipe(
      filter(() => !!this.map.has(key)),
      map(() => this.map.get(key))
    );
  }

  public flushCache(): Observable<boolean> {
    return this.items.asObservable().pipe(
      map(items => {
        items.forEach(i => this.removeItem(i['key']));
        return true;
      })
    );
  }
}
