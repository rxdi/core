"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
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
        layer.items.forEach(item => this.onExpire(item['key']));
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
        const filteredItems = this.items
            .getValue()
            .filter(item => item['key'] !== layerItem['key']);
        this.items.next([...filteredItems, item]);
        this.putItemHook(layerItem);
        return layerItem;
    }
    onExpire(key) {
        return new rxjs_1.Observable(observer => observer.next())
            .pipe(operators_1.timeoutWith(this.config.maxAge, rxjs_1.of(1)), operators_1.skip(1), operators_1.take(1))
            .subscribe(() => this.removeItem(key));
    }
    removeItem(key) {
        const newLayerItems = this.items
            .getValue()
            .filter(item => item['key'] !== key);
        this.map.delete(key);
        this.items.next(newLayerItems);
    }
    getItemObservable(key) {
        return this.items.asObservable().pipe(operators_1.filter(() => !!this.map.has(key)), operators_1.map(() => this.map.get(key)));
    }
    flushCache() {
        return this.items.asObservable().pipe(operators_1.map(items => {
            items.forEach(i => this.removeItem(i['key']));
            return true;
        }));
    }
}
exports.CacheLayer = CacheLayer;
