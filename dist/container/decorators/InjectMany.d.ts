import { Token } from '../Token';
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function InjectMany(type?: (type?: any) => Function): Function;
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function InjectMany(serviceName?: string): Function;
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function InjectMany(token: Token<any>): Function;
