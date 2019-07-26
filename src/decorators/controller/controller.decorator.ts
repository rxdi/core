import { ReflectDecorator } from '../../helpers/reflect.decorator';

export function Controller<T>(options?: T | { init?: boolean }): Function {
  return ReflectDecorator(options, { type: 'controller' });
}
