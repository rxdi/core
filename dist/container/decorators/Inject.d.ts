import { Token } from '../Token';
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function Inject(type?: (type?: any) => Function): Function;
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function Inject(serviceName?: string): Function;
/**
 * Injects a service into a class property or constructor parameter.
 */
export declare function Inject(token: Token<any>): Function;
