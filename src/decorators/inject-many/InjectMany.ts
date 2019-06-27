import { Container } from '../../container/Container';
import { Token } from '../../container/Token';
import { getIdentifier, isClient } from '../../helpers/get-identifier';
import { TypeOrName } from '../../container/types/type-or-name';

/**
 * Injects a service into a class property or constructor parameter.
 */
export function InjectMany(type?: (type?: any) => Function): Function;

/**
 * Injects a service into a class property or constructor parameter.
 */
export function InjectMany(serviceName?: string): Function;

/**
 * Injects a service into a class property or constructor parameter.
 */
export function InjectMany(token: Token<any>): Function;

/**
 * Injects a service into a class property or constructor parameter.
 */
export function InjectMany(
  typeOrName?: TypeOrName
): Function {
  return function(target: Object, propertyName: string, index?: number) {
    if (isClient() && typeOrName instanceof Token) {
      Object.defineProperty(target, propertyName, {
        get: () =>
          Container.getMany(getIdentifier(typeOrName, target, propertyName))
      });
      return;
    }
    if (!typeOrName) {
      typeOrName = () =>
        (Reflect as any).getMetadata('design:type', target, propertyName);
    }
    Container.registerHandler({
      object: target,
      propertyName: propertyName,
      index: index,
      value: instance =>
        instance.getMany(getIdentifier(typeOrName, target, propertyName))
    });
  };
}
