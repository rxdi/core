"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const Token_1 = require("../Token");
const get_identifier_1 = require("../../helpers/get-identifier");
/**
 * Injects a service into a class property or constructor parameter.
 */
function InjectMany(typeOrName) {
    return function (target, propertyName, index) {
        if (get_identifier_1.isClient() && typeOrName instanceof Token_1.Token) {
            Object.defineProperty(target, propertyName, {
                get: () => Container_1.Container.getMany(get_identifier_1.getIdentifier(typeOrName, target, propertyName))
            });
            return;
        }
        if (!typeOrName) {
            typeOrName = () => Reflect.getMetadata('design:type', target, propertyName);
        }
        Container_1.Container.registerHandler({
            object: target,
            propertyName: propertyName,
            index: index,
            value: instance => instance.getMany(get_identifier_1.getIdentifier(typeOrName, target, propertyName))
        });
    };
}
exports.InjectMany = InjectMany;
