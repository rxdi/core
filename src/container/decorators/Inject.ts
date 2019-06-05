import { Container } from '../Container';
import { Token } from '../Token';
import { CannotInjectError } from '../error/CannotInjectError';

const isServer = () => typeof module !== 'undefined' && module.exports;

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
export function Inject(typeOrName?: ((type?: any) => Function) | string | Token<any>): Function {
    return function (target: Object, propertyName: string, index?: number) {
        if (!isServer() && typeOrName && typeof typeOrName === 'function') {
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
            value: containerInstance => {
                let identifier: any;
                if (typeof typeOrName === 'string') {
                    identifier = typeOrName;

                } else if (typeOrName instanceof Token) {
                    identifier = typeOrName;

                } else {
                    identifier = typeOrName();
                }

                if (identifier === Object)
                    throw new CannotInjectError(target, propertyName);
                return containerInstance.get<any>(identifier);
            }
        });
    };
}
