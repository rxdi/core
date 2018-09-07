"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = require("./sha256");
function createUniqueHash(key) {
    return sha256_1.sha256.hash(key);
}
exports.createUniqueHash = createUniqueHash;
