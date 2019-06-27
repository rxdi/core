import { ServiceOptions } from '../../container/types/ServiceOptions';
import { Token } from '../../container/Token';
export interface TypeProvide<T> extends Function {
    new (...args: any[]): T;
}
/**
 * Marks class as a service that can be injected using Container.
 */
export declare function Service(): Function;
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
