"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./reflection");
const container_1 = require("../container");
const bootstrap_service_1 = require("../services/bootstrap/bootstrap.service");
const exit_handler_1 = require("./exit-handler");
exit_handler_1.exitHandlerInit();
const bootstrapService = container_1.Container.get(bootstrap_service_1.BootstrapService);
exports.Bootstrap = (app, config) => bootstrapService.start(app, config);
exports.BootstrapPromisify = (app, config) => bootstrapService.start(app, config).toPromise();
exports.BootstrapFramework = (app, modules, config) => {
    bootstrapService.configService.setConfig(config);
    modules.map(m => container_1.Container.get(m));
    return bootstrapService.start(app, config);
};
exports.setup = (options, frameworks = [], bootstrapOptions) => {
    const Module = require('../decorators/module/module.decorator').Module;
    return exports.BootstrapFramework(Module({
        imports: options.imports || [],
        providers: options.providers || [],
        services: options.services || [],
        bootstrap: options.bootstrap || [],
        components: options.components || [],
        controllers: options.controllers || [],
        effects: options.effects || [],
        plugins: options.plugins || [],
        afterPlugins: options.afterPlugins || [],
        beforePlugins: options.beforePlugins || []
    })(function () { }), frameworks, bootstrapOptions);
};
exports.createTestBed = exports.setup;
