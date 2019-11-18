"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Metadata = new WeakMap();
function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
    return ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
}
exports.defineMetadata = defineMetadata;
function decorate(decorators, target, propertyKey, attributes) {
    if (decorators.length === 0) {
        throw new TypeError();
    }
    if (typeof target === 'function') {
        return decorateConstructor(decorators, target);
    }
    else if (propertyKey !== undefined) {
        return decorateProperty(decorators, target, propertyKey, attributes);
    }
    return;
}
exports.decorate = decorate;
function metadata(metadataKey, metadataValue) {
    return function decorator(target, propertyKey) {
        ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    };
}
exports.metadata = metadata;
function getMetadata(metadataKey, target, propertyKey) {
    return ordinaryGetMetadata(metadataKey, target, propertyKey);
}
exports.getMetadata = getMetadata;
function getOwnMetadata(metadataKey, target, propertyKey) {
    return ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}
exports.getOwnMetadata = getOwnMetadata;
function hasOwnMetadata(metadataKey, target, propertyKey) {
    return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey);
}
exports.hasOwnMetadata = hasOwnMetadata;
function decorateConstructor(decorators, target) {
    decorators.reverse().forEach(decorator => {
        const decorated = decorator(target);
        if (decorated) {
            target = decorated;
        }
    });
    return target;
}
function decorateProperty(decorators, target, propertyKey, descriptor) {
    decorators.reverse().forEach(decorator => {
        descriptor = decorator(target, propertyKey, descriptor) || descriptor;
    });
    return descriptor;
}
function ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey) {
    if (propertyKey && !['string', 'symbol'].includes(typeof propertyKey)) {
        throw new TypeError();
    }
    (getMetadataMap(target, propertyKey) ||
        createMetadataMap(target, propertyKey)).set(metadataKey, metadataValue);
}
function ordinaryGetMetadata(metadataKey, target, propertyKey) {
    return !!ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
        ? ordinaryGetOwnMetadata(metadataKey, target, propertyKey)
        : Object.getPrototypeOf(target)
            ? ordinaryGetMetadata(metadataKey, Object.getPrototypeOf(target), propertyKey)
            : undefined;
}
function ordinaryGetOwnMetadata(metadataKey, target, propertyKey) {
    if (target === undefined) {
        throw new TypeError();
    }
    const metadataMap = getMetadataMap(target, propertyKey);
    return metadataMap && metadataMap.get(metadataKey);
}
function getMetadataMap(target, propertyKey) {
    return Metadata.get(target) && Metadata.get(target).get(propertyKey);
}
function createMetadataMap(target, propertyKey) {
    const targetMetadata = Metadata.get(target) || new Map();
    Metadata.set(target, targetMetadata);
    const metadataMap = targetMetadata.get(propertyKey) || new Map();
    targetMetadata.set(propertyKey, metadataMap);
    return metadataMap;
}
exports.Reflection = {
    decorate,
    defineMetadata,
    getMetadata,
    getOwnMetadata,
    hasOwnMetadata,
    metadata
};
Object.assign(Reflect, exports.Reflection);
// # sourceMappingURL=index.js.map
