const XXH = require('./sha256');

export function createUniqueHash(key) {
    return XXH.h32(key, 0xABCD).toString(16);
}