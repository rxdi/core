import { ReflectDecorator } from '../../helpers/reflect.decorator';

export function Effect(options?: {init?: boolean}): Function {
    return ReflectDecorator<any, any>(options, { type: 'effect' });
}