import { Token } from '../Token';
/**
 * Unique service identifier.
 * Can be some class type, or string id, or instance of Token.
 */
export declare type ServiceIdentifier<T = any> = Function | Token<T> | string | {
    service: T;
};
