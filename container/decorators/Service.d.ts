import { ServiceOptions } from '../types/ServiceOptions';
import { Token } from '../Token';
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(): Function;
export declare function Service(config: {
    providedIn?: Type<any> | 'root' | null;
    useFactory?: () => any;
}): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(name: string): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(token: Token<any>): Function;
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function;
