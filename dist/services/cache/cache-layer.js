"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const forEach_1 = require("../../services/module/helpers/forEach");
class CacheLayer {
    constructor(layer) {
        this.items = new rxjs_1.BehaviorSubject([]);
        this.map = new Map();
        this.name = layer.name;
        this.config = layer.config;
        this.initHook(layer);
    }
    get(name) {
        return this.map.get(name);
    }
    initHook(layer) {
        if (this.config.maxAge) {
            this.onExpireAll(layer);
        }
    }
    onExpireAll(layer) {
        forEach_1.forEach(layer.items, item => this.onExpire(item['key']));
    }
    putItemHook(layerItem) {
        if (this.config.maxAge) {
            this.onExpire(layerItem['key']);
        }
    }
    getItem(key) {
        if (this.map.has(key)) {
            return this.get(key);
        }
        else {
            return null;
        }
    }
    putItem(layerItem) {
        this.map.set(layerItem['key'], layerItem);
        const item = this.get(layerItem['key']);
        const filteredItems = this.items.getValue().filter(item => item['key'] !== layerItem['key']);
        this.items.next([...filteredItems, item]);
        this.putItemHook(layerItem);
        return layerItem;
    }
    onExpire(key) {
        rxjs_1.Observable
            .create(observer => observer.next())
            .timeoutWith(this.config.maxAge, rxjs_1.of(1))
            .skip(1)
            .subscribe(() => this.removeItem(key));
    }
    removeItem(key) {
        const newLayerItems = this.items.getValue().filter(item => item['key'] !== key);
        this.map.delete(key);
        this.items.next(newLayerItems);
    }
    getItemObservable(key) {
        return this.items.asObservable()
            .pipe(operators_1.filter(() => !!this.map.has(key)), operators_1.map(() => this.map.get(key)));
    }
    flushCache() {
        return this.items.asObservable()
            .pipe(operators_1.map(items => {
            forEach_1.forEach(items, i => this.removeItem(i['key']));
            return true;
        }));
    }
}
exports.CacheLayer = CacheLayer;
