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
const Service_1 = require("../../decorators/service/Service");
const rxjs_1 = require("rxjs");
const http_1 = require("http");
const https_1 = require("https");
const request_cache_service_1 = require("./request.cache.service");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const operators_1 = require("rxjs/operators");
const bootstrap_logger_1 = require("../bootstrap-logger");
let RequestService = class RequestService {
    get(link, cacheHash) {
        if (this.cache.cacheLayer.map.has(link)) {
            this.logger.log(`Item returned from cacahe: ${link}`);
            return rxjs_1.of(this.cache.cacheLayer.get(link).data);
        }
        return new rxjs_1.Observable(o => {
            if (link.includes('https://')) {
                https_1.get(link, resp => {
                    let data = '';
                    resp.on('data', chunk => (data += chunk));
                    resp.on('end', () => o.next(data));
                }).on('error', err => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            }
            else {
                http_1.get(link, resp => {
                    let data = '';
                    resp.on('data', chunk => (data += chunk));
                    resp.on('end', () => o.next(data));
                }).on('error', err => {
                    console.error('Error: ' + err.message);
                    o.error(err);
                });
            }
        }).pipe(operators_1.tap(res => this.cache.cacheLayer.putItem({ key: link, data: res })));
    }
};
__decorate([
    injector_decorator_1.Injector(request_cache_service_1.RequestCacheService),
    __metadata("design:type", request_cache_service_1.RequestCacheService)
], RequestService.prototype, "cache", void 0);
__decorate([
    injector_decorator_1.Injector(bootstrap_logger_1.BootstrapLogger),
    __metadata("design:type", bootstrap_logger_1.BootstrapLogger)
], RequestService.prototype, "logger", void 0);
RequestService = __decorate([
    Service_1.Service()
], RequestService);
exports.RequestService = RequestService;
