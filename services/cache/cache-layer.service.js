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
const bootstrap_logger_1 = require("../bootstrap-logger");
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
        const allLayers = Array.from(this.map.keys());
        const foundLayers = [];
        allLayers.forEach(item => {
            if (item !== events_1.InternalLayers.modules && item !== events_1.InternalLayers.globalConfig) {
                const config = this.getLayer(item).getItem(events_1.InternalEvents.config);
                // console.log(config);
                if (config && config.data && name === config.data.moduleName) {
                    foundLayers.push(this.getLayer(config.data.moduleHash));
                }
            }
        });
        return foundLayers;
    }
    searchForDuplicateDependenciesInsideApp() {
        const currentModuleDependenciesKeys = [];
        Array.from(this.map.keys()).forEach(key => {
            const currentModule = this.getLayer(key);
            // console.log(key, currentModule.map.keys());
            const currentModuleDependencies = Array.from(currentModule.map.keys());
            currentModuleDependencies.forEach(key => {
                if (key === events_1.InternalEvents.load || key === events_1.InternalEvents.config || key === events_1.InternalEvents.init) {
                    return;
                }
                currentModuleDependenciesKeys.push(key);
            });
            const layer = this.getLayer(key);
            const config = layer.getItem(events_1.InternalEvents.config);
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
            const moduleType = dups[0].class['metadata']['type'].charAt(0).toUpperCase() + dups[0].class['metadata']['type'].slice(1);
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
    searchForItem(classItem) {
        let itemFound;
        const library = Array.from(this.map.keys());
        library
            .forEach(module => {
            const currentModule = this.getLayer(module);
            const currentModuleDependencies = Array.from(currentModule.map.keys());
            const found = currentModuleDependencies.filter((i => {
                if (i === events_1.InternalEvents.config || i === events_1.InternalEvents.load || i === events_1.InternalEvents.init) {
                    return;
                }
                else {
                    return i === classItem.name;
                }
            }));
            if (found.length) {
                itemFound = currentModule.getItem(found[0]).data;
            }
        });
        return itemFound;
    }
    searchForDuplicatesByHash(key) {
        let itemFound = [];
        const library = Array.from(this.map.keys());
        library.forEach(module => {
            const currentModule = this.getLayer(module);
            const currentModuleDependencies = Array.from(currentModule.map.keys());
            const found = currentModuleDependencies.filter((i => {
                if (i === events_1.InternalEvents.config || i === events_1.InternalEvents.load || i === events_1.InternalEvents.init) {
                    return;
                }
                return i === key;
            }));
            if (found.length) {
                const currentFoundItem = currentModule.getItem(found[0]);
                // console.log('FOUND!', module,currentModule.getItem(found[0]).key);
                const currentModuleName = this.getLayer(module).getItem(events_1.InternalEvents.config);
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
        if (layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval) {
            this.OnExpire(layerInstance);
        }
    }
    protectLayerFromInvaders(cacheLayer) {
        cacheLayer.items.constructor.prototype.unsubsribeFromLayer = cacheLayer.items.constructor.prototype.unsubscribe;
        cacheLayer.items.constructor.prototype.unsubscribe = () => {
            console.error(FRIENDLY_ERROR_MESSAGES.TRY_TO_UNSUBSCRIBE + cacheLayer.name);
        };
    }
    OnExpire(layerInstance) {
        rxjs_1.Observable
            .create(observer => observer.next())
            .timeoutWith(layerInstance.config.cacheFlushInterval || this.config.cacheFlushInterval, rxjs_1.of(1))
            .skip(1)
            .subscribe(observer => this.removeLayer(layerInstance));
    }
    removeLayer(layerInstance) {
        this.map.delete(layerInstance.name);
        this._cachedLayers.next([...this._cachedLayers.getValue().filter(layer => layer.name !== layerInstance.name)]);
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
        return this._cachedLayers
            .pipe(operators_1.take(1), operators_1.map((layers) => {
            oldLayersNames = layers.map(l => l.name);
            layers.forEach(layer => this.removeLayer(layer));
            oldLayersNames.forEach((l) => this.createLayer({ name: l }));
            return true;
        }));
    }
};
CacheService = CacheService_1 = __decorate([
    container_1.Service(),
    __metadata("design:paramtypes", [bootstrap_logger_1.BootstrapLogger])
], CacheService);
exports.CacheService = CacheService;
