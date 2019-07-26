import { ReflectDecorator } from '../../helpers/reflect.decorator';
export interface PluginInterface {
    name?: string;
    version?: string;
    register(server?, options?): void;
    handler?(request, h);
}
export function Plugin(options?: any): Function {
    return ReflectDecorator(options, { type: 'plugin' });
}