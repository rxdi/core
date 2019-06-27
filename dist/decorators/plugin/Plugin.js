"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_decorator_1 = require("../../helpers/reflect.decorator");
function Plugin(options) {
    return reflect_decorator_1.ReflectDecorator(options, { type: 'plugin' });
}
exports.Plugin = Plugin;
