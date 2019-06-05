"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const Token_1 = require("../Token");
const CannotInjectError_1 = require("../error/CannotInjectError");
const isClient = () => typeof module !== 'undefined' && module.exports && module['hot'];
/**
 * Injects a service into a class property or constructor parameter.
 */
function InjectMany(typeOrName) {
    return function (target, propertyName, index) {
        if (isClient() && typeOrName instanceof Token_1.Token) {
            Object.defineProperty(target, propertyName, {
                get: () => prepareToken(Container_1.Container, target, propertyName, typeOrName)
            });
            return;
        }
        if (!typeOrName)
            typeOrName = () => Reflect.getMetadata('design:type', target, propertyName);
        Container_1.Container.registerHandler({
            object: target,
            propertyName: propertyName,
            index: index,
            value: containerInstance => prepareToken(containerInstance, target, propertyName, typeOrName)
        });
    };
}
exports.InjectMany = InjectMany;
function prepareToken(containerInstance, target, propertyName, typeOrName) {
    let identifier;
    if (typeof typeOrName === 'string') {
        identifier = typeOrName;
    }
    else if (typeOrName instanceof Token_1.Token) {
        identifier = typeOrName;
    }
    else {
        identifier = typeOrName();
    }
    if (identifier === Object)
        throw new CannotInjectError_1.CannotInjectError(target, propertyName);
    return containerInstance.getMany(identifier);
}
