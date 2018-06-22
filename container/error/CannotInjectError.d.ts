/**
 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
 */
export declare class CannotInjectError extends Error {
    name: string;
    constructor(target: Object, propertyName: string);
}
