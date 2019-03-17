"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XXH = require('./sha256');
function createUniqueHash(key) {
    return XXH.h32(key, 0xABCD).toString(16);
}
exports.createUniqueHash = createUniqueHash;
