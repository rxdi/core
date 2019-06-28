import { ReflectDecorator } from '../../helpers/reflect.decorator';
export interface PluginInterface {
    name?: string;
    version?: string;
    register(server?, options?): void;
    handler?(request, h);
}
export function Plugin<T, K extends keyof T>(options?: any): Function {
    return ReflectDecorator<T, K>(options, { type: 'plugin' });
}