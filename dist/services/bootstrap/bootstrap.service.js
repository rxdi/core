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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const container_1 = require("../../container");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const cache_layer_service_1 = require("../cache/cache-layer.service");
const events_1 = require("../../helpers/events");
const lazy_factory_service_1 = require("../lazy-factory/lazy-factory.service");
const config_service_1 = require("../config/config.service");
const plugin_service_1 = require("../plugin/plugin.service");
const operators_1 = require("rxjs/operators");
const effect_service_1 = require("../effect/effect.service");
const controllers_service_1 = require("../controllers/controllers.service");
const components_service_1 = require("../components/components.service");
const bootstraps_service_1 = require("../bootstraps/bootstraps.service");
const services_service_1 = require("../services/services.service");
const after_starter_service_1 = require("../after-starter/after-starter.service");
const log_1 = require("../../helpers/log");
let BootstrapService = class BootstrapService {
    constructor(logger, cacheService, lazyFactoriesService, configService, controllersService, effectsService, pluginService, componentsService, bootstrapsService, servicesService, afterStarterService) {
        this.logger = logger;
        this.cacheService = cacheService;
        this.lazyFactoriesService = lazyFactoriesService;
        this.configService = configService;
        this.controllersService = controllersService;
        this.effectsService = effectsService;
        this.pluginService = pluginService;
        this.componentsService = componentsService;
        this.bootstrapsService = bootstrapsService;
        this.servicesService = servicesService;
        this.afterStarterService = afterStarterService;
        this.globalConfig = this.cacheService.createLayer({
            name: events_1.InternalLayers.globalConfig
        });
    }
    start(app, config) {
        this.configService.setConfig(config);
        this.globalConfig.putItem({ key: events_1.InternalEvents.config, data: config });
        container_1.Container.get(app);
        const lazyFactoryKeys = Array.from(this.lazyFactoriesService.lazyFactories.keys());
        return rxjs_1.of(lazyFactoryKeys).pipe(operators_1.map(factories => this.prepareAsyncChainables(factories)), operators_1.switchMap(res => rxjs_1.combineLatest(res).pipe(operators_1.take(1), operators_1.map(c => this.attachLazyLoadedChainables(lazyFactoryKeys, c)), operators_1.map(() => this.validateSystem()), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableControllers())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsBeforeRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsAfterRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableServices())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableEffects())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableComponents())), operators_1.map(() => this.loadApplication()), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableBootstraps())), operators_1.map(() => this.final()))));
    }
    final() {
        this.afterStarterService.appStarted.next(true);
        if (!this.configService.config.init) {
            this.logger.log('Bootstrap -> press start!');
        }
        return container_1.Container;
    }
    asyncChainableComponents() {
        return [
            rxjs_1.of(true),
            ...this.componentsService
                .getComponents()
                .filter(c => this.genericFilter(c, 'components'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableBootstraps() {
        return [
            rxjs_1.of(true),
            ...this.bootstrapsService
                .getBootstraps()
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableEffects() {
        return [
            rxjs_1.of(true),
            ...this.effectsService
                .getEffects()
                .filter(c => this.genericFilter(c, 'effects'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableServices() {
        return [
            rxjs_1.of(true),
            ...this.servicesService
                .getServices()
                .filter(c => this.genericFilter(c, 'services'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableControllers() {
        return [
            rxjs_1.of(true),
            ...this.controllersService
                .getControllers()
                .filter(c => this.genericFilter(c, 'controllers'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainablePluginsRegister() {
        return [
            rxjs_1.of(true),
            ...this.pluginService
                .getPlugins()
                .filter(c => this.genericFilter(c, 'plugins'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield this.registerPlugin(c); }))
        ];
    }
    asyncChainablePluginsAfterRegister() {
        return [
            rxjs_1.of(true),
            ...this.pluginService
                .getAfterPlugins()
                .filter(c => this.genericFilter(c, 'pluginsAfter'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield this.registerPlugin(c); }))
        ];
    }
    asyncChainablePluginsBeforeRegister() {
        return [
            rxjs_1.of(true),
            ...this.pluginService
                .getBeforePlugins()
                .filter(c => this.genericFilter(c, 'pluginsBefore'))
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield this.registerPlugin(c); }))
        ];
    }
    genericFilter(c, name) {
        return (this.configService.config.initOptions[name] ||
            (c.metadata.options && c.metadata.options['init']) ||
            this.configService.config.init);
    }
    registerPlugin(pluggable) {
        return __awaiter(this, void 0, void 0, function* () {
            const plugin = container_1.Container.get(pluggable);
            yield plugin.register();
            return plugin;
        });
    }
    prepareAsyncChainables(injectables) {
        const asynChainables = [rxjs_1.of(true)];
        const injectableLog = {};
        const getName = n => n.name || n;
        injectables.map(i => {
            const date = Date.now();
            injectableLog[getName(i)] = {
                started: date,
                end: null
            };
            this.logger.log(`Bootstrap -> @Service('${getName(i)}'): loading...`);
            const somethingAsync = rxjs_1.from((this.lazyFactoriesService.getLazyFactory(i))).pipe(operators_1.shareReplay(1));
            asynChainables.push(somethingAsync);
            somethingAsync.subscribe(() => {
                this.logger.log(`Bootstrap -> @Service('${getName(i)}'): loading finished after ${Date.now() -
                    injectableLog[getName(i)].started}ms !`);
                delete injectableLog[getName(i)];
            });
        });
        return asynChainables;
    }
    validateSystem() {
        if (this.configService.config.strict) {
            this.cacheService.searchForDuplicateDependenciesInsideApp();
        }
    }
    attachLazyLoadedChainables(res, chainables) {
        // Remove first chainable unused observable
        chainables.splice(0, 1);
        let count = 0;
        res.map((name) => {
            log_1.logExtendedInjectables(name, this.configService.config.experimental.logExtendedInjectables);
            container_1.Container.set(name, chainables[count++]);
        });
        return true;
    }
    loadApplication() {
        Array.from(this.cacheService.getLayer(events_1.InternalLayers.modules).map.keys()).forEach(m => this.cacheService.getLayer(m).putItem({
            key: events_1.InternalEvents.load,
            data: this.configService.config.init
        }));
        return true;
    }
};
BootstrapService = __decorate([
    container_1.Service(),
    __metadata("design:paramtypes", [bootstrap_logger_1.BootstrapLogger,
        cache_layer_service_1.CacheService,
        lazy_factory_service_1.LazyFactory,
        config_service_1.ConfigService,
        controllers_service_1.ControllersService,
        effect_service_1.EffectsService,
        plugin_service_1.PluginService,
        components_service_1.ComponentsService,
        bootstraps_service_1.BootstrapsServices,
        services_service_1.ServicesService,
        after_starter_service_1.AfterStarterService])
], BootstrapService);
exports.BootstrapService = BootstrapService;
