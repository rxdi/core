import { Container } from '../../container/Container';
import { Token } from '../../container/Token';
import { getIdentifier, isClient } from '../../helpers/get-identifier';
import { TypeOrName } from '../../container/types/type-or-name';

/**
 * Injects a service into a class property or constructor parameter.
 */
export function Inject(type?: (type?: any) => Function): Function;

/**
 * Injects a service into a class property or constructor parameter.
 */
export function Inject(serviceName?: string): Function;

/**
 * Injects a service into a class property or constructor parameter.
 */
export function Inject(token: Token<any>): Function;

export function Inject(fn: Function): Function;


/**
 * Injects a service into a class property or constructor parameter.
 */
export function Inject(typeOrName?: TypeOrName): Function {
    return function (target: Object, propertyName: string, index?: number) {
        if (isClient() && typeOrName && typeof typeOrName === 'function') {
            Object.defineProperty(target, propertyName, {
                get: () => Container.get(typeOrName as Function)
            });
            return;
        }
        if (!typeOrName)
            typeOrName = () => (Reflect as any).getMetadata('design:type', target, propertyName);

        Container.registerHandler({
            object: target,
            propertyName: propertyName,
            index: index,
            value: instance => instance.get(getIdentifier(typeOrName, target, propertyName))
        });
    };
}
