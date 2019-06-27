"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_decorator_1 = require("../../helpers/reflect.decorator");
function Controller(options) {
    return reflect_decorator_1.ReflectDecorator(options, { type: 'controller' });
}
exports.Controller = Controller;
