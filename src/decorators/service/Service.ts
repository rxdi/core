import { ServiceOptions } from '../../container/types/ServiceOptions';
import { Token } from '../../container/Token';
import { ReflectDecorator } from '../../helpers/reflect.decorator';

export interface TypeProvide<T> extends Function {
    new(...args: any[]): T;
}
/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(): Function;

// export function Service(config: { providedIn?: TypeProvide<any> | 'root' | null, useFactory?: () => any }): Function;

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(name: string): Function;

/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(token: Token<any>): Function;


/**
 * Marks class as a service that can be injected using Container.
 */
export function Service<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function;

/**
 * Marks class as a service that can be injected using container.
 */
export function Service(options?: ServiceOptions<any, any> | Token<any> | string): Function {
    return ReflectDecorator(options, { type: 'service' });
}

