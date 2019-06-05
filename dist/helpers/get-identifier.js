"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("../container/Token");
const CannotInjectError_1 = require("../container/error/CannotInjectError");
exports.getIdentifier = (typeOrName, target, propertyName) => {
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
    if (identifier === Object) {
        throw new CannotInjectError_1.CannotInjectError(target, propertyName);
    }
    return identifier;
};
exports.isClient = () => typeof module !== 'undefined' && module.exports && module['hot'];
