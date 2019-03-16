"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const module_service_1 = require("../../services/module/module.service");
function InjectSoft(Service) {
    return container_1.Container.get(module_service_1.ModuleService).watcherService.getByClass(Service);
}
exports.InjectSoft = InjectSoft;
