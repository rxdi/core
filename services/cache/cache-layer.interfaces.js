"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheServiceConfigInterface {
    constructor() {
        this.deleteOnExpire = 'aggressive';
        this.cacheFlushInterval = 60 * 60 * 1000;
        this.maxAge = 15 * 60 * 1000;
        this.localStorage = false;
    }
}
exports.CacheServiceConfigInterface = CacheServiceConfigInterface;
