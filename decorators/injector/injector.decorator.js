"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
function Injector(Service) {
    return function (target, propertyName, index) {
        const service = container_1.Container.get(Service);
        target[propertyName] = service;
    };
}
exports.Injector = Injector;
