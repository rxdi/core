import { ServiceMetadata } from '../types/ServiceMetadata';
import { Container } from '../Container';
import { ServiceOptions } from '../types/ServiceOptions';
import { Token } from '../Token';
import { createUniqueHash } from '../../helpers/create-unique-hash';

interface Type<T> extends Function {
    new(...args: any[]): T;
}
/**
 * Marks class as a service that can be injected using Container.
 */
export function Service(): Function;

export function Service(config: { providedIn?: Type<any> | 'root' | null, useFactory?: () => any }): Function;

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
export function Service<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string | { useFactory?: () => any; providedIn?: Type<any> | 'root' | null }): Function {
    return function (target: Function) {

        const uniqueHashForClass = createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });

        target['metadata'] = {
            useFactory: optionsOrServiceName && optionsOrServiceName['useFactory'] || null,
            provideIn: optionsOrServiceName && optionsOrServiceName['provideIn'] || 'root',
            options: optionsOrServiceName || null,
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'service',
            raw: `
            ---- @Service '${target.name}' metadata----
            @Service()
            ${target['originalName']}
            `
        };


        const service: ServiceMetadata<T, K> = {
            type: target
        };

        if (typeof optionsOrServiceName === 'string' || optionsOrServiceName instanceof Token) {
            service.id = optionsOrServiceName;
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;

        } else if (optionsOrServiceName) { // ServiceOptions
            service.id = (optionsOrServiceName as ServiceOptions<T, K>).id;
            service.factory = (optionsOrServiceName as ServiceOptions<T, K>).factory;
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;
        }

        Container.set(service);
    };
}

