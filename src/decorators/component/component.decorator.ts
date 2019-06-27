import { ReflectDecorator } from '../../helpers/reflect.decorator';

export function Component<T, K extends keyof T>(options?: {
  init?: boolean;
}): Function {
  return ReflectDecorator<T, K>(options, { type: 'component' });
}
