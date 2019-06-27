"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_decorator_1 = require("../../helpers/reflect.decorator");
function Component(options) {
    return reflect_decorator_1.ReflectDecorator(options, { type: 'component' });
}
exports.Component = Component;
