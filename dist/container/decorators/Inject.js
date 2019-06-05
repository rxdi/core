"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const get_identifier_1 = require("../../helpers/get-identifier");
/**
 * Injects a service into a class property or constructor parameter.
 */
function Inject(typeOrName) {
    return function (target, propertyName, index) {
        if (get_identifier_1.isClient() && typeOrName && typeof typeOrName === 'function') {
            Object.defineProperty(target, propertyName, {
                get: () => Container_1.Container.get(typeOrName)
            });
            return;
        }
        if (!typeOrName)
            typeOrName = () => Reflect.getMetadata('design:type', target, propertyName);
        Container_1.Container.registerHandler({
            object: target,
            propertyName: propertyName,
            index: index,
            value: instance => instance.get(get_identifier_1.getIdentifier(typeOrName, target, propertyName))
        });
    };
}
exports.Inject = Inject;
