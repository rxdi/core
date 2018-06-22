"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
 */
class CannotInjectError extends Error {
    constructor(target, propertyName) {
        super(`Cannot inject value into '${target.constructor.name}.${propertyName}'. ` +
            `Please make sure you setup reflect-metadata properly and you don't use interfaces without service tokens as injection value.`);
        this.name = 'ServiceNotFoundError';
        Object.setPrototypeOf(this, CannotInjectError.prototype);
    }
}
exports.CannotInjectError = CannotInjectError;
