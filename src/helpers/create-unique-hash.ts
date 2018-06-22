import { createHash } from 'crypto';

export function createUniqueHash(key) {
    return createHash('md5').update(key).digest('hex');
}