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
let ModuleService = class ModuleService {
    setServices(services, original, currentModule) {
        services.forEach(service => {
            this.validateServices(service, original);
            service.deps = service.deps || [];
            if (service.provide && service.provide.constructor === Function) {
                service.provide = service.provide['name'];
            }
            if (service.deps.length) {
                service.deps = service.deps.map(dep => container_1.Container.get(dep));
            }
            if (service.provide && service.useFactory) {
                const factory = service.useFactory;
                service.useFactory = () => factory(...service.deps);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, service.useFactory());
                }
                else {
                    container_1.Container.set(service.provide, service.useFactory());
                }
            }
            else if (service.provide && service.useDynamic) {
                const factory = this.externalImporter.importModule(service.useDynamic);
                this.lazyFactoryService.setLazyFactory(service.provide, factory);
            }
            else if (service.provide && service.useClass && service.useClass.constructor === Function) {
                const currentClass = new service.useClass(...service.deps);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, rxjs_1.of(currentClass));
                }
                else {
                    container_1.Container.get(service.useClass);
                }
            }
            else if (service.provide && service.useValue) {
                container_1.Container.set(service.provide, service.useValue);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, rxjs_1.of(container_1.Container.get(service.provide)));
                }
            }
            else {
                currentModule.putItem({
                    data: service,
                    key: service.name
                });
            }
        });
    }
    setPlugins(plugins, currentModule) {
        plugins.forEach(plugin => {
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.register(plugin);
        });
    }
    setAfterPlugins(plugins) {
        plugins.forEach(plugin => this.pluginService.registerAfter(plugin));
    }
    setBeforePlugins(plugins) {
        plugins.forEach(plugin => this.pluginService.registerBefore(plugin));
    }
    validateImports(m, original) {
        if (m.metadata.type !== 'module') {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1)} '${m.originalName}' provided, where expected class decorated with '@Module' instead,
            
            -> @Hint: please provide class with @Module decorator or remove ${m.originalName} from imports
            `);
        }
    }
    validateServices(m, original) {
        if (!m) {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: ${original.metadata.moduleName}
            -> @Module hash: ${original.metadata.moduleHash}
                --> Maybe you forgot to import some service inside ${original.metadata.moduleName} ?

                Hint: run ts-lint again, looks like imported service is undefined or null inside ${original.metadata.moduleName}
            `);
        }
        if (m.provide) {
            return;
        }
        if (m.metadata.type !== 'service') {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1)} '${m.metadata.moduleName}' provided, where expected class decorated with '@Service' instead,
            
            -> @Hint: please provide class with @Service decorator or remove ${m.metadata.moduleName} from services
            `);
        }
    }
    setImports(module, original) {
        module.imports.forEach((m) => {
            this.validateImports(m, original);
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
    injector_decorator_1.Injector(external_importer_1.ExternalImporter),
    __metadata("design:type", external_importer_1.ExternalImporter)
], ModuleService.prototype, "externalImporter", void 0);
ModuleService = __decorate([
    container_1.Service()
], ModuleService);
exports.ModuleService = ModuleService;
