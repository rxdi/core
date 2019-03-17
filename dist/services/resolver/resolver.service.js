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
const container_1 = require("../../container");
const cache_layer_service_1 = require("../cache/cache-layer.service");
const events_1 = require("../../helpers/events");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const forEach_1 = require("../../services/module/helpers/forEach");
let ResolverService = class ResolverService {
    resolveDependencies(hash, target, moduleName) {
        this.cacheService.getLayer(events_1.InternalLayers.modules).putItem({ key: hash, data: target });
        const currentModule = this.cacheService.getLayer(hash);
        currentModule.putItem({ key: events_1.InternalEvents.config, data: { moduleName, moduleHash: hash } });
        return currentModule.getItemObservable(events_1.InternalEvents.load)
            .pipe(operators_1.switchMap((config) => {
            if (!config.data) {
                return rxjs_1.of(null);
            }
            return currentModule.items.asObservable();
        }), operators_1.filter((res) => res && res.length), operators_1.map(this.resolveContainerDependencies(target, moduleName)));
    }
    resolveContainerDependencies(target, moduleName) {
        return (res) => {
            forEach_1.forEach(res, (i) => {
                if (i.key === events_1.InternalEvents.load || i.key === events_1.InternalEvents.config) {
                    return;
                }
                const found = this.cacheService.searchForItem(i.data);
                if (found) {
                    if (found.provide) {
                        return found;
                    }
                    const moduleType = found.metadata.type.charAt(0).toUpperCase() + found.metadata.type.slice(1);
                    this.bootstrapLogger.log(`Start -> @Module('${moduleName}')${this.bootstrapLogger.logHashes(`(${target.name})`)}: @${moduleType}('${found.originalName}')${this.bootstrapLogger.logHashes(`(${found.name})`)}` + ' initialized!');
                    return container_1.Container.get(found);
                }
                else {
                    throw new Error('not found');
                }
            });
            return res;
        };
    }
};
__decorate([
    injector_decorator_1.Injector(bootstrap_logger_1.BootstrapLogger),
    __metadata("design:type", bootstrap_logger_1.BootstrapLogger)
], ResolverService.prototype, "bootstrapLogger", void 0);
__decorate([
    injector_decorator_1.Injector(cache_layer_service_1.CacheService),
    __metadata("design:type", cache_layer_service_1.CacheService)
], ResolverService.prototype, "cacheService", void 0);
ResolverService = __decorate([
    container_1.Service()
], ResolverService);
exports.ResolverService = ResolverService;
