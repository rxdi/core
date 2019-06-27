import { Token } from '../../container/Token';
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
export declare function Inject(fn: Function): Function;
