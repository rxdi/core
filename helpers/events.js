"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function strEnum(o) {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
exports.InternalEvents = strEnum(['load', 'init', 'config']);
exports.InternalLayers = strEnum(['globalConfig', 'modules']);
