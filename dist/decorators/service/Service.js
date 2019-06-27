"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflect_decorator_1 = require("../../helpers/reflect.decorator");
/**
 * Marks class as a service that can be injected using container.
 */
function Service(options) {
    return reflect_decorator_1.ReflectDecorator(options, { type: 'service' });
}
exports.Service = Service;
