import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { CacheLayer } from '../cache/cache-layer';
import { CacheLayerItem, CacheLayerInterface, Duplicates } from '../cache/cache-layer.interfaces';
import { InternalEvents, InternalLayers } from '../../helpers/events';
import { Service } from '../../container';
import { Metadata } from 'decorators/module/module.interfaces';
import { BootstrapLogger } from '../bootstrap-logger';

const FRIENDLY_ERROR_MESSAGES = {
  TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: '
};

@Service()
export class CacheService {

  constructor(
    private logger: BootstrapLogger
  ) { }

  public _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]> = new BehaviorSubject([]);
  public map: Map<any, any> = new Map();
  config: any = {};

  public static createCacheInstance<T>(cacheLayer): CacheLayer<CacheLayerItem<T>> {
    return new CacheLayer<CacheLayerItem<T>>(cacheLayer);
  }

  public getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>> {
    const exists = this.map.has(name);
    if (!exists) {
      return this.createLayer<T>({ name: name });
    }
    return this.map.get(name);
  }

  public getLayersByName<T>(name: string): CacheLayer<CacheLayerItem<T>>[] {
    const allLayers = Array.from(this.map.keys());
    const foundLayers = [];
    allLayers.forEach(item => {
      if (item !== InternalLayers.modules && item !== InternalLayers.globalConfig) {
        const config = this.getLayer<{ moduleName: string, moduleHash: string }>(item).getItem(InternalEvents.config);
        // console.log(config);
        if (config && config.data && name === config.data.moduleName) {
          foundLayers.push(this.getLayer(config.data.moduleHash));
        }
      }
    });
    return foundLayers;
  }

  public searchForDuplicateDependenciesInsideApp() {
    const currentModuleDependenciesKeys = [];
    Array.from(this.map.keys()).forEach(key => {

      const currentModule = this.getLayer(key);
      // console.log(key, currentModule.map.keys());
      const currentModuleDependencies = Array.from(currentModule.map.keys());
      currentModuleDependencies.forEach(key => {
        if (key === InternalEvents.load || key === InternalEvents.config || key === InternalEvents.init) {
          return;
        }
        currentModuleDependenciesKeys.push(key);
      });
      const layer = this.getLayer<any>(key);
      const config = layer.getItem(InternalEvents.config);
      if (config) {
        const realNames = [];
        const filteredDependencies = currentModuleDependencies.filter(i => !!i).filter(i => i.length >= 32);
        filteredDependencies.forEach(dep => realNames.push(layer.getItem(dep).data.metadata.moduleName));
        // this.logger.log(`@gapi(Start) -> module name: '${config.data.moduleName}' dependencies ->\n${JSON.stringify(realNames, null, 2)}`);
      }
    });
    // console.log(currentModuleDependenciesKeys);
    const uniq = currentModuleDependenciesKeys.map((name) => Object.create({ count: 1, name: name }))
      .reduce((a, b) => {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
      }, {});
    const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    if (duplicates.length) {
      const dups = this.searchForDuplicatesByHash(duplicates[0]);
      throw new Error(`
                ${dups[0].class['metadata'].raw}
                Service: '${dups[0].originalName}' found multiple times!
                Service hash: ${dups[0].moduleHash}
                Modules: [${dups[0].moduleName}, ${dups[1].moduleName}]

                Hint: '${dups[0].originalName}' class identity hash is identical in both
                imported files inside ${dups[0].moduleName} and ${dups[1].moduleName}
                consider removing one of the '${dups[0].originalName}' services
            `);
    }
    return duplicates;
  }

  public searchForItem(classItem) {
    let itemFound;
    const library = Array.from(this.map.keys());
    library
      .forEach(module => {
        const currentModule = this.getLayer(module);
        const currentModuleDependencies = Array.from(currentModule.map.keys());
        const found = currentModuleDependencies.filter((i => {
          if (i === InternalEvents.config || i === InternalEvents.load || i === InternalEvents.init) {
            return;
          } else {
            return i === classItem.name;
          }
        }));

        if (found.length) {
          itemFound = currentModule.getItem(found[0]).data;
        }
      });
    return itemFound;
  }

  public searchForDuplicatesByHash(key: string) {

    let itemFound: Duplicates[] = [];
    const library = Array.from(this.map.keys());
    library.forEach(module => {
      const currentModule = this.getLayer<any>(module);
      const currentModuleDependencies = Array.from(currentModule.map.keys());
      const found = currentModuleDependencies.filter((i => {
        if (i === InternalEvents.config || i === InternalEvents.load || i === InternalEvents.init) {
          return;
        }
        return i === key;
      }));

      if (found.length) {
        const currentFoundItem = currentModule.getItem(found[0]);
        // console.log('FOUND!', module,currentModule.getItem(found[0]).key);
        const currentModuleName = this.getLayer<Metadata>(module).getItem(InternalEvents.config);
        itemFound = [...itemFound, {
          moduleName: currentModuleName.data.moduleName,
          moduleHash: currentModuleName.data.moduleHash,
          originalName: currentFoundItem.data.originalName,
          dupeName: currentFoundItem.key,
          raw: currentModuleName.data.raw,
          class: currentFoundItem.data
        }];
      }
    });
    return itemFound;
  }

  public createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>> {
    const exists = this.map.has(layer.name);
    if (exists) {
      return this.map.get(layer.name);
    }
    layer.items = layer.items || [];
    layer.config = layer.config || this.config;
    const cacheLayer = CacheService.createCacheInstance<T>(layer);
    this.map.set(cacheLayer.name, cacheLayer);
    this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
    this.LayerHook<T>(cacheLayer);
    return cacheLayer;
  }

  private LayerHook<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.protectLayerFromInvaders<T>(layerInstance);
    if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
      this.OnExpire(layerInstance);
    }
  }

  private protectLayerFromInvaders<T>(cacheLayer: CacheLayer<CacheLayerItem<T>>): void {
    cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
    cacheLayer.items.constructor.prototype.unsubscribe = () => {
      console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
    };
  }

  private OnExpire<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    Observable
      .create(observer => observer.next())
      .timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, of(1))
      .skip(1)
      .subscribe(observer => this.removeLayer(layerInstance));
  }

  public removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void {
    this.map.delete(layerInstance.name);
    this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
  }

  public transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[] {
    const oldLayer = this.getLayer(name);
    const newLayers = [];
    newCacheLayers.forEach(layerName => {
      const newLayer = this.createLayer(layerName);
      oldLayer.items.getValue().forEach(item => newLayer.putItem(item));
      newLayers.push(newLayer);
    });
    return newLayers;
  }

  public flushCache(): Observable<boolean> {
    let oldLayersNames: string[];
    return this._cachedLayers
      .pipe(
        take(1),
        map((layers: any[]) => {
          oldLayersNames = layers.map(l => l.name);
          layers.forEach(layer => this.removeLayer(layer));
          oldLayersNames.forEach((l) => this.createLayer({ name: l }));
          return true;
        })
      );
  }

}