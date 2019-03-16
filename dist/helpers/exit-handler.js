"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exit_handler_service_1 = require("../services/exit-handler/exit-handler.service");
const container_1 = require("../container");
exports.exitHandlerInit = () => {
    const handler = container_1.Container.get(exit_handler_service_1.ExitHandlerService);
    handler.init();
    // do something when app is closing
    process.on('exit', handler.exitHandler.bind(handler, { cleanup: true }));
    // catches ctrl+c event
    process.on('SIGINT', handler.exitHandler.bind(handler, { exit: true }));
    // catches 'kill pid' (for example: nodemon restart)
    process.on('SIGUSR1', handler.exitHandler.bind(handler, { exit: true }));
    process.on('SIGUSR2', handler.exitHandler.bind(handler, { exit: true }));
    // catches uncaught exceptions
    process.on('uncaughtException', handler.exitHandler.bind(handler, { exit: true }));
};
