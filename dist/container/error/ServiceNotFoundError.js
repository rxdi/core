"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../Token");
/**
 * Thrown when requested service was not found.
 */
class ServiceNotFoundError extends Error {
    constructor(identifier) {
        super();
        this.name = 'ServiceNotFoundError';
        if (typeof identifier === 'string') {
            this.message =
                `Service '${identifier}' was not found, looks like it was not registered in the container. ` +
                    `Register it by calling Container.set('${JSON.stringify(identifier)}', ...) before using service.`;
        }
        else if (identifier instanceof Token_1.Token && identifier.name) {
            this.message =
                `Service '${identifier.name}' was not found, looks like it was not registered in the container. ` +
                    `Register it by calling Container.set before using service.`;
        }
        else if (identifier instanceof Token_1.Token) {
            this.message =
                `Service with a given token was not found, looks like it was not registered in the container. ` +
                    `Register it by calling Container.set before using service.`;
        }
        Object.setPrototypeOf(this, ServiceNotFoundError.prototype);
    }
}
exports.ServiceNotFoundError = ServiceNotFoundError;
