"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Thrown when service is registered without type.
 */
class MissingProvidedServiceTypeError extends Error {
    constructor(identifier) {
        super(`Cannot determine a class of the requesting service '${JSON.stringify(identifier)}'`);
        this.name = 'ServiceNotFoundError';
        Object.setPrototypeOf(this, MissingProvidedServiceTypeError.prototype);
    }
}
exports.MissingProvidedServiceTypeError = MissingProvidedServiceTypeError;
