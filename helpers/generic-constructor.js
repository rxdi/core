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
            moduleService.setImports(module, original);
        }
        if (module.services) {
            moduleService.setServices(module.services, original, currentModule);
        }
        if (module.beforePlugins && module.beforePlugins.length) {
            moduleService.setBeforePlugins(module.beforePlugins);
        }
        if (module.plugins) {
            moduleService.setPlugins(module.plugins, currentModule);
        }
        if (module.afterPlugins && module.afterPlugins.length) {
            moduleService.setAfterPlugins(module.afterPlugins);
        }
        bootstrapLogger.log(`Bootstrap -> @Module('${constructor.originalName}')${bootstrapLogger.logHashes(`(${constructor.name})`)}: finished!`);
        return new constructor();
    };
}
exports.GenericConstruct = GenericConstruct;
