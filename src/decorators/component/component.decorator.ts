import { ReflectDecorator } from '../../helpers/reflect.decorator';

export function Component(options?: {
  init?: boolean;
}): Function {
  return ReflectDecorator(options, { type: 'component' });
}
