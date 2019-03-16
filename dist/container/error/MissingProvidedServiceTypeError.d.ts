/**
 * Thrown when service is registered without type.
 */
export declare class MissingProvidedServiceTypeError extends Error {
    name: string;
    constructor(identifier: any);
}
