"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_unique_hash_1 = require("../../helpers/create-unique-hash");
const Container_1 = require("../../container/Container");
function Effect(options) {
    return function (target) {
        const uniqueHashForClass = create_unique_hash_1.createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });
        target['metadata'] = {
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'effect',
            options: options || null,
            raw: `
            ---- @Effect '${target.name}' metadata----
            @Effect()
            ${target['originalName']}
            `
        };
        const service = {
            type: target
        };
        Container_1.Container.set(service);
    };
}
exports.Effect = Effect;