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
const index_1 = require("../cache/index");
const container_1 = require("../../container");
const bootstrap_logger_1 = require("../bootstrap-logger");
const Service_1 = require("../../decorators/service/Service");
let RequestCacheService = class RequestCacheService extends index_1.CacheService {
    constructor() {
        super(container_1.Container.get(bootstrap_logger_1.BootstrapLogger));
        this.cacheLayer = this.createLayer({ name: 'request-cache-layer' });
    }
    put(key, data) {
        return this.cacheLayer.putItem({ key, data });
    }
    get(key) {
        return this.cacheLayer.getItem(key);
    }
};
RequestCacheService = __decorate([
    Service_1.Service(),
    __metadata("design:paramtypes", [])
], RequestCacheService);
exports.RequestCacheService = RequestCacheService;
