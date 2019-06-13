"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_unique_hash_1 = require("../../helpers/create-unique-hash");
const Container_1 = require("../../container/Container");
function Component(options) {
    return function (target) {
        const uniqueHashForClass = create_unique_hash_1.createUniqueHash(`${target}${JSON.stringify(options, null, 4)}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });
        target['metadata'] = {
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            options: options || null,
            type: 'component',
            raw: `
            ---- @Component '${target.name}' metadata----
            @Component(${JSON.stringify(options, null, 4)})
            ${target['originalName']}
            `
        };
        const service = {
            type: target
        };
        Container_1.Container.set(service);
    };
}
exports.Component = Component;
