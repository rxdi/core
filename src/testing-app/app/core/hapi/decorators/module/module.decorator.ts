
import { Module as M, ModuleArguments, PluginInterface } from '@rxdi/core';

export interface ModuleType<T, K> extends ModuleArguments<T, K> {
    controllers?: Array<any>;
    effects?: Array<any>;
    routes?: Array<any>;
}

export function Module<T, K extends keyof T>(options?: ModuleType<T, K>): Function {
    const controllers = options.controllers || [];
    const effects = options.controllers || [];
    const imports = options.imports || [];
    const services = options.services || [];
    const plugins = options.plugins || [];
    const routes = options.routes || [];

    return M<T, K>({
        imports: [...imports],
        services: [...services, ...effects, ...controllers],
        plugins: [...plugins,  ...routes]
    });
}