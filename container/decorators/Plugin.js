"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { ControllerContainerService } from '../../services/controller-service/controller.service';
const Token_1 = require("../Token");
const Container_1 = require("../Container");
const create_unique_hash_1 = require("../../helpers/create-unique-hash");
function Plugin(optionsOrServiceName) {
    return function (target) {
        const original = target;
        original.prototype._plugin = true;
        const uniqueHashForClass = create_unique_hash_1.createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });
        target['metadata'] = {
            useFactory: optionsOrServiceName && optionsOrServiceName['useFactory'] || null,
            provideIn: optionsOrServiceName && optionsOrServiceName['provideIn'] || 'root',
            options: optionsOrServiceName || null,
            moduleName: target['originalName'],
            moduleHash: target['name'],
            raw: `${target}`,
            type: 'plugin',
        };
        const service = {
            type: original
        };
        if (typeof optionsOrServiceName === 'string' || optionsOrServiceName instanceof Token_1.Token) {
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
exports.Plugin = Plugin;
