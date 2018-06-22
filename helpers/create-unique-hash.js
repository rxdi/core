"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function createUniqueHash(key) {
    return crypto_1.createHash('md5').update(key).digest('hex');
}
exports.createUniqueHash = createUniqueHash;
