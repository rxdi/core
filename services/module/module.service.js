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
const lazy_factory_service_1 = require("../lazy-factory/lazy-factory.service");
const plugin_service_1 = require("../plugin/plugin.service");
const external_importer_1 = require("../external-importer");
const rxjs_1 = require("rxjs");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const validators_1 = require("./helpers/validators");
const constructor_watcher_1 = require("../constructor-watcher/constructor-watcher");
const controllers_1 = require("../controllers");
const effect_1 = require("../effect");
const components_1 = require("../components");
let ModuleService = class ModuleService {
    constructor() {
        this.watcherService = constructor_watcher_1.constructorWatcherService;
    }
    setServices(services, original, currentModule) {
        services.forEach(service => {
            this.validators.validateServices(service, original);
            this.setInjectedDependencies(service);
            if (service.provide && service.provide.constructor === Function) {
                service.provide = service.provide['name'];
            }
            if (service.provide && service.useFactory) {
                this.setUseFactory(service);
            }
            else if (service.provide && service.useDynamic) {
                this.setUseDynamic(service);
            }
            else if (service.provide && service.useClass && service.useClass.constructor === Function) {
                this.setUseClass(service);
            }
            else if (service.provide && service.useValue) {
                this.setUseValue(service);
            }
            else {
                currentModule.putItem({ data: service, key: service.name });
            }
        });
    }
    setInjectedDependencies(service) {
        service.deps = service.deps || [];
        if (service.deps.length) {
            service.deps = service.deps.map(dep => container_1.Container.get(dep));
        }
    }
    setUseValue(service) {
        container_1.Container.set(service.provide, service.useValue);
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, rxjs_1.of(container_1.Container.get(service.provide)));
        }
    }
    setUseClass(service) {
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, rxjs_1.of(container_1.Container.get(service.useClass)));
        }
        else {
            container_1.Container.set(service.provide, container_1.Container.get(service.useClass));
        }
    }
    setUseDynamic(service) {
        const factory = this.externalImporter.importModule(service.useDynamic);
        this.lazyFactoryService.setLazyFactory(service.provide, factory);
    }
    setUseFactory(service) {
        const factory = service.useFactory;
        service.useFactory = () => factory(...service.deps);
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, service.useFactory());
        }
        else {
            container_1.Container.set(service.provide, service.useFactory());
        }
    }
    setControllers(controllers, original, currentModule) {
        controllers.forEach(controller => {
            this.validators.validateController(controller, original);
            currentModule.putItem({
                data: controller,
                key: controller.name
            });
            this.controllersService.register(controller);
        });
    }
    setEffects(effects, original, currentModule) {
        effects.forEach(effect => {
            this.validators.validateEffect(effect, original);
            currentModule.putItem({
                data: effect,
                key: effect.name
            });
            this.effectsService.register(effect);
        });
    }
    setComponents(components, original, currentModule) {
        components.forEach(component => {
            this.validators.validateComponent(component, original);
            currentModule.putItem({
                data: component,
                key: component.name
            });
            this.componentsService.register(component);
        });
    }
    setPlugins(plugins, original, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.register(plugin);
        });
    }
    setAfterPlugins(plugins, original, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.registerAfter(plugin);
        });
    }
    setBeforePlugins(plugins, original, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.registerBefore(plugin);
        });
    }
    setImports(imports, original) {
        imports.forEach((m) => {
            this.validators.validateImports(m, original);
            if (!m) {
                throw new Error('Missing import module');
            }
            else {
                container_1.Container.get(m);
            }
        });
    }
};
__decorate([
    injector_decorator_1.Injector(lazy_factory_service_1.LazyFactory),
    __metadata("design:type", lazy_factory_service_1.LazyFactory)
], ModuleService.prototype, "lazyFactoryService", void 0);
__decorate([
    injector_decorator_1.Injector(plugin_service_1.PluginService),
    __metadata("design:type", plugin_service_1.PluginService)
], ModuleService.prototype, "pluginService", void 0);
__decorate([
    injector_decorator_1.Injector(components_1.ComponentsService),
    __metadata("design:type", components_1.ComponentsService)
], ModuleService.prototype, "componentsService", void 0);
__decorate([
    injector_decorator_1.Injector(controllers_1.ControllersService),
    __metadata("design:type", controllers_1.ControllersService)
], ModuleService.prototype, "controllersService", void 0);
__decorate([
    injector_decorator_1.Injector(effect_1.EffectsService),
    __metadata("design:type", effect_1.EffectsService)
], ModuleService.prototype, "effectsService", void 0);
__decorate([
    injector_decorator_1.Injector(external_importer_1.ExternalImporter),
    __metadata("design:type", external_importer_1.ExternalImporter)
], ModuleService.prototype, "externalImporter", void 0);
__decorate([
    injector_decorator_1.Injector(validators_1.ModuleValidators),
    __metadata("design:type", validators_1.ModuleValidators)
], ModuleService.prototype, "validators", void 0);
ModuleService = __decorate([
    container_1.Service()
], ModuleService);
exports.ModuleService = ModuleService;
