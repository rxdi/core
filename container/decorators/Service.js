"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const Token_1 = require("../Token");
const create_unique_hash_1 = require("../../helpers/create-unique-hash");
/**
 * Marks class as a service that can be injected using container.
 */
function Service(optionsOrServiceName) {
    return function (target) {
        const uniqueHashForClass = create_unique_hash_1.createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });
        target['metadata'] = {
            useFactory: optionsOrServiceName && optionsOrServiceName['useFactory'] || null,
            provideIn: optionsOrServiceName && optionsOrServiceName['provideIn'] || 'root',
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'service',
            raw: `
            ---- @Service '${target.name}' metadata----
            @Service()
            ${target['originalName']}
            `
        };
        const service = {
            type: target
        };
        if (typeof optionsOrServiceName === 'string' || optionsOrServiceName instanceof Token_1.Token) {
            service.id = optionsOrServiceName;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        else if (optionsOrServiceName) {
            service.id = optionsOrServiceName.id;
            service.factory = optionsOrServiceName.factory;
            service.multiple = optionsOrServiceName.multiple;
            service.global = optionsOrServiceName.global || false;
            service.transient = optionsOrServiceName.transient;
        }
        Container_1.Container.set(service);
    };
}
exports.Service = Service;
