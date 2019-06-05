"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../Container");
const Token_1 = require("../Token");
const CannotInjectError_1 = require("../error/CannotInjectError");
const isServer = () => typeof module !== 'undefined' && module.exports;
const isClient = () => typeof module !== 'undefined' && module.exports && module['hot'];
/**
 * Injects a service into a class property or constructor parameter.
 */
function Inject(typeOrName) {
    return function (target, propertyName, index) {
        if (isClient() && typeOrName && typeof typeOrName === 'function') {
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
            value: containerInstance => {
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
                return containerInstance.get(identifier);
            }
        });
    };
}
exports.Inject = Inject;
