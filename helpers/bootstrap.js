"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const container_1 = require("../container");
const bootstrap_service_1 = require("../services/bootstrap/bootstrap.service");
const exit_handler_1 = require("./exit-handler");
exit_handler_1.exitHandlerInit();
const bootstrapService = container_1.Container.get(bootstrap_service_1.BootstrapService);
exports.Bootstrap = (app, config) => bootstrapService.start(app, config);
exports.BootstrapPromisify = (app, config) => bootstrapService.start(app, config).toPromise();
exports.BootstrapFramework = (app, modules, config) => {
    modules.map(m => container_1.Container.get(m));
    return bootstrapService.start(app, config);
};
