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
let BootstrapService = class BootstrapService {
    constructor(logger, cacheService, lazyFactoriesService, configService, controllersService, effectsService, pluginService, componentsService, bootstrapsService, servicesService) {
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
        this.chainableObservable = rxjs_1.of(true);
        this.asyncChainables = [this.chainableObservable];
        this.filterInit = (c) => c['metadata']['options'] && c['metadata']['options']['init'];
        this.globalConfig = this.cacheService.createLayer({ name: events_1.InternalLayers.globalConfig });
    }
    start(app, config) {
        this.configService.setConfig(config);
        this.globalConfig.putItem({ key: events_1.InternalEvents.init, data: config });
        this.filterInit = (c) => config.init || c['metadata']['options'] && c['metadata']['options']['init'];
        container_1.Container.get(app);
        return rxjs_1.of(Array.from(this.lazyFactoriesService.lazyFactories.keys()))
            .pipe(operators_1.map((i) => i.map(injectable => this.prepareAsyncChainables(injectable))), operators_1.switchMap((res) => rxjs_1.combineLatest(this.asyncChainables)
            .pipe(operators_1.take(1), operators_1.map((c) => this.attachLazyLoadedChainables(res, c)), operators_1.map(() => this.validateSystem()), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableServices())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableControllers())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableEffects())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsBeforeRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainablePluginsAfterRegister())), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableComponents())), operators_1.map(() => this.loadApplication()), operators_1.switchMap(() => rxjs_1.combineLatest(this.asyncChainableBootstraps())), operators_1.map(() => this.final()))));
    }
    final() {
        // opn('https://theft.youvolio.com');
        // const globalConfig = cache.createLayer<{ init: boolean }>({ name: InternalLayers.globalConfig });
        // cache.getLayer('AppModule').putItem({key:InternalEvents.load, data: true});
        // cache.getLayer('UserModule').putItem({ key: InternalEvents.load, data: true });
        // console.log('bla bla', plugins);!
        // Bootstrapping finished!
        return true;
    }
    asyncChainablePluginsRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getPlugins()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return this.registerPlugin(c); }))
        ];
    }
    asyncChainableComponents() {
        return [
            this.chainableObservable,
            ...this.componentsService.getComponents()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableBootstraps() {
        return [
            this.chainableObservable,
            ...this.bootstrapsService.getBootstraps()
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableEffects() {
        return [
            this.chainableObservable,
            ...this.effectsService.getEffects()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableServices() {
        return [
            this.chainableObservable,
            ...this.servicesService.getServices()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    asyncChainableControllers() {
        return [
            this.chainableObservable,
            ...this.controllersService.getControllers()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield container_1.Container.get(c); }))
        ];
    }
    registerPlugin(pluggable) {
        return __awaiter(this, void 0, void 0, function* () {
            const plugin = container_1.Container.get(pluggable);
            yield plugin.register();
            return plugin;
        });
    }
    asyncChainablePluginsAfterRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getAfterPlugins()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return yield this.registerPlugin(c); }))
        ];
    }
    asyncChainablePluginsBeforeRegister() {
        return [
            this.chainableObservable,
            ...this.pluginService.getBeforePlugins()
                .filter(this.filterInit)
                .map((c) => __awaiter(this, void 0, void 0, function* () { return this.registerPlugin(c); }))
        ];
    }
    prepareAsyncChainables(injectable) {
        this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading...`);
        const somethingAsync = rxjs_1.from(this.lazyFactoriesService.getLazyFactory(injectable));
        this.asyncChainables.push(somethingAsync);
        // somethingAsync
        //     .subscribe(
        //         () => this.logger.log(`Bootstrap -> @Service('${injectable.name || injectable}'): loading finished! ${new Date().toLocaleTimeString()}`)
        //     );
        return injectable;
    }
    validateSystem() {
        this.cacheService.searchForDuplicateDependenciesInsideApp();
    }
    attachLazyLoadedChainables(res, chainables) {
        // Remove first chainable unused observable
        chainables.splice(0, 1);
        let count = 0;
        res.map(name => container_1.Container.set(name, chainables[count++]));
        return true;
    }
    loadApplication() {
        this.logger.log('Bootstrap -> press start!');
        Array.from(this.cacheService.getLayer(events_1.InternalLayers.modules).map.keys())
            .forEach(m => this.cacheService.getLayer(m)
            .putItem({ key: events_1.InternalEvents.load, data: this.configService.config.init }));
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
        services_service_1.ServicesService])
], BootstrapService);
exports.BootstrapService = BootstrapService;
