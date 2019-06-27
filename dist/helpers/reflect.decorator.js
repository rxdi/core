"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_unique_hash_1 = require("./create-unique-hash");
const Container_1 = require("../container/Container");
const Token_1 = require("../container/Token");
function ReflectDecorator(options, metaOptions) {
    return (target) => {
        const uniqueHashForClass = create_unique_hash_1.createUniqueHash(`${target}${JSON.stringify(options, null, 4)}`);
        Object.defineProperty(target, 'originalName', {
            value: target.name || target.constructor.name,
            writable: false
        });
        Object.defineProperty(target, 'name', {
            value: uniqueHashForClass,
            writable: true
        });
        const nameCapitalized = (name) => name.charAt(0).toUpperCase() + name.slice(1);
        target['metadata'] = {
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            options: options || null,
            type: metaOptions.type,
            raw: `
        ---- @${nameCapitalized(metaOptions.type)} '${target.name}' metadata----
        @${nameCapitalized(metaOptions.type)}(${JSON.stringify(options, null, 4)})
        ${target['originalName']}
        `
        };
        const service = {
            type: target
        };
        if (typeof options === 'string' || options instanceof Token_1.Token) {
            service.id = options;
            service.multiple = options.multiple;
            service.global = options.global || false;
            service.transient = options.transient;
        }
        else if (options) { // ServiceOptions
            service.id = options.id;
            service.factory = options.factory;
            service.multiple = options.multiple;
            service.global = options.global || false;
            service.transient = options.transient;
        }
        Container_1.Container.set(service);
    };
}
exports.ReflectDecorator = ReflectDecorator;
