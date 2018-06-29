"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../container");
const services_1 = require("../services");
const moduleService = container_1.Container.get(services_1.ModuleService);
const bootstrapLogger = container_1.Container.get(services_1.BootstrapLogger);
function GenericConstruct(module, original, currentModule) {
    return function construct(constructor, args) {
        if (!module) {
            return new constructor();
        }
        if (module.imports) {
            moduleService.setImports(module.imports, original);
        }
        if (module.services) {
            moduleService.setServices(module.services, original, currentModule);
        }
        if (module.controllers) {
            moduleService.setControllers(module.controllers, original, currentModule);
        }
        if (module.effects) {
            moduleService.setEffects(module.effects, original, currentModule);
        }
        if (module.components) {
            moduleService.setComponents(module.components, original, currentModule);
        }
        if (module.beforePlugins) {
            moduleService.setBeforePlugins(module.beforePlugins, original, currentModule);
        }
        if (module.plugins) {
            moduleService.setPlugins(module.plugins, original, currentModule);
        }
        if (module.afterPlugins) {
            moduleService.setAfterPlugins(module.afterPlugins, original, currentModule);
        }
        if (module.bootstrap) {
            moduleService.setBootstraps(module.bootstrap, original, currentModule);
        }
        bootstrapLogger.log(`Bootstrap -> @Module('${constructor.originalName}')${bootstrapLogger.logHashes(`(${constructor.name})`)}: finished!`);
        return new constructor();
    };
}
exports.GenericConstruct = GenericConstruct;
