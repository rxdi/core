import { Container } from '../../container';

export function Injector<T>(Service: T): Function {
    return function (target: Function, propertyName: string) {
        Object.defineProperty(target, propertyName, {
          get: () => Container.get(Service)
        });
    };
}
