"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const module_service_1 = require("../../services/module/module.service");
const watcherService = container_1.Container.get(module_service_1.ModuleService).watcherService;
function Injector(Service) {
    return function (target, propertyName, index) {
        const service = container_1.Container.get(Service);
        target[propertyName] = service;
    };
}
exports.Injector = Injector;
function InjectSoft(Service) {
    return watcherService.getByClass(Service)['value'];
}
exports.InjectSoft = InjectSoft;
