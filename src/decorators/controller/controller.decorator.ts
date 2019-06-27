import { ReflectDecorator } from '../../helpers/reflect.decorator';

export function Controller<T, K extends keyof T>(options?: T | {init?: boolean}): Function {
    return ReflectDecorator<T, K>(options, { type: 'controller' });
}