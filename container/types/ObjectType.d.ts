/**
 * Special type allows to use Function and get known its type as T.
 */
export declare type ObjectType<T> = {
    new (...args: any[]): T;
};
