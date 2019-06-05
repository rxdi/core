import { sha256 } from './sha256';
export function createUniqueHash(key) {
  return sha256.hash(key);
}
