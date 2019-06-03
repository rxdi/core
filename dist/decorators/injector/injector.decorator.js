"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
function Injector(Service) {
    return function (target, propertyName) {
        Object.defineProperty(target, propertyName, {
            get: () => container_1.Container.get(Service)
        });
    };
}
exports.Injector = Injector;
