import { ServiceIdentifier } from '../types/ServiceIdentifier';
/**
 * Thrown when requested service was not found.
 */
export declare class ServiceNotFoundError extends Error {
    name: string;
    constructor(identifier: ServiceIdentifier);
}
