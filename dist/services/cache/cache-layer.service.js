"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CacheService_1;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const cache_layer_1 = require("./cache-layer");
const events_1 = require("../../helpers/events");
const container_1 = require("../../container");
const index_1 = require("../bootstrap-logger/index");
const FRIENDLY_ERROR_MESSAGES = {
    TRY_TO_UNSUBSCRIBE: 'Someone try to unsubscribe from collection directly... agghhh.. read docs! Blame: '
};
let CacheService = CacheService_1 = class CacheService {
    constructor(logger) {
        this.logger = logger;
        this._cachedLayers = new rxjs_1.BehaviorSubject([]);
        this.map = new Map();
        this.config = {};
    }
    static createCacheInstance(cacheLayer) {
        return new cache_layer_1.CacheLayer(cacheLayer);
    }
    getLayer(name) {
        const exists = this.map.has(name);
        if (!exists) {
            return this.createLayer({ name: name });
        }
        return this.map.get(name);
    }
    getLayersByName(name) {
        return Array.from(this.map.keys())
            .map(item => {
            if (item !== events_1.InternalLayers.modules &&
                item !== events_1.InternalLayers.globalConfig) {
                const config = this.getLayer(item).getItem(events_1.InternalEvents.config);
                if (config && config.data && name === config.data.moduleName) {
                    return this.getLayer(config.data.moduleHash);
                }
            }
        })
            .filter(i => !!i);
    }
    searchForDuplicateDependenciesInsideApp() {
        const uniq = [].concat
            .apply([], Array.from(this.map.keys()).map(key => Array.from(this.getLayer(key).map.keys())
            .map(key => (!this.isExcludedEvent(key) ? key : null))
            .filter(i => !!i)))
            .map(name => Object.create({ count: 1, name }))
            .reduce((a, b) => {
            a[b.name] = (a[b.name] || 0) + b.count;
            return a;
        }, {});
        const duplicates = Object.keys(uniq).filter(a => uniq[a] > 1);
        if (duplicates.length) {
            const dups = this.searchForDuplicatesByHash(duplicates[0]);
            const moduleType = dups[0].class['metadata']['type'].charAt(0).toUpperCase() +
                dups[0].class['metadata']['type'].slice(1);
            throw new Error(`
                ${dups[0].class['metadata'].raw}
                ${moduleType}: '${dups[0].originalName}' found multiple times!
                ${moduleType} hash: ${dups[0].moduleHash}
                Modules: [${dups[0].moduleName}, ${dups[1].moduleName}]

                Hint: '${dups[0].originalName}' class identity hash is identical in both
                imported files inside ${dups[0].moduleName} and ${dups[1].moduleName}
                consider removing one of the '${dups[0].originalName}'
            `);
        }
        return duplicates;
    }
    isExcludedEvent(i) {
        return i === events_1.InternalEvents.config || i === events_1.InternalEvents.load;
    }
    searchForItem(classItem) {
        return Array.from(this.map.keys()).map(module => {
            const currentModule = this.getLayer(module);
            const currentModuleDependencies = Array.from(currentModule.map.keys());
            const found = currentModuleDependencies.filter(i => {
                if (this.isExcludedEvent(i)) {
                    return;
                }
                else {
                    return i === classItem.name;
                }
            });
            if (found.length) {
                return currentModule.getItem(found[0]).data;
            }
        }).filter(i => !!i)[0];
    }
    searchForDuplicatesByHash(key) {
        return Array.from(this.map.keys()).map(module => {
            const currentModule = this.getLayer(module);
            const found = Array.from(currentModule.map.keys()).filter(i => {
                if (this.isExcludedEvent(i)) {
                    return;
                }
                return i === key;
            });
            if (found.length) {
                const currentFoundItem = currentModule.getItem(found[0]);
                const currentModuleName = this.getLayer(module).getItem(events_1.InternalEvents.config);
                return {
                    moduleName: currentModuleName.data.moduleName,
                    moduleHash: currentModuleName.data.moduleHash,
                    originalName: currentFoundItem.data.originalName,
                    dupeName: currentFoundItem.key,
                    raw: currentModuleName.data.raw,
                    class: currentFoundItem.data
                };
            }
        }).filter(i => !!i);
    }
    createLayer(layer) {
        const exists = this.map.has(layer.name);
        if (exists) {
            return this.map.get(layer.name);
        }
        layer.items = layer.items || [];
        layer.config = layer.config || this.config;
        const cacheLayer = CacheService_1.createCacheInstance(layer);
        this.map.set(cacheLayer.name, cacheLayer);
        this._cachedLayers.next([...this._cachedLayers.getValue(), cacheLayer]);
        this.LayerHook(cacheLayer);
        return cacheLayer;
    }
    LayerHook(layerInstance) {
        this.protectLayerFromInvaders(layerInstance);
        if (layerInstance.config.cacheFlushInterval ||
            this.config.cacheFlushInterval) {
            this.OnExpire(layerInstance);
        }
    }
    protectLayerFromInvaders(cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer =
            cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = () => {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
    }
    OnExpire(layerInstance) {
        return new rxjs_1.Observable(observer => observer.next())
            .pipe(operators_1.timeoutWith(layerInstance.config.cacheFlushInterval ||
            this.config.cacheFlushInterval, rxjs_1.of(1)), operators_1.skip(1), operators_1.take(1))
            .subscribe(() => this.removeLayer(layerInstance));
    }
    removeLayer(layerInstance) {
        this.map.delete(layerInstance.name);
        this._cachedLayers.next([
            ...this._cachedLayers
                .getValue()
                .filter(layer => layer.name !== layerInstance.name)
        ]);
    }
    transferItems(name, newCacheLayers) {
        const oldLayer = this.getLayer(name);
        const newLayers = [];
        newCacheLayers.forEach(layerName => {
            const newLayer = this.createLayer(layerName);
            oldLayer.items.getValue().forEach(item => newLayer.putItem(item));
            newLayers.push(newLayer);
        });
        return newLayers;
    }
    flushCache() {
        let oldLayersNames;
        return this._cachedLayers.pipe(operators_1.take(1), operators_1.map((layers) => {
            oldLayersNames = layers.map(l => l.name);
            layers.forEach(layer => this.removeLayer(layer));
            oldLayersNames.forEach(l => this.createLayer({ name: l }));
            return true;
        }));
    }
};
CacheService = CacheService_1 = __decorate([
    container_1.Service(),
    __metadata("design:paramtypes", [index_1.BootstrapLogger])
], CacheService);
exports.CacheService = CacheService;
