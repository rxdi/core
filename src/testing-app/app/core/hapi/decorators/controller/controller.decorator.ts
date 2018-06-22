
import { Service as S, ModuleArguments, ServiceOptions } from '@rxdi/core'; 

export interface ModuleType<T, K> extends ModuleArguments<T, K> {
    controllers?: Array<any>
    effects?: Array<any>
}

export function Controller<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function {
    return S<T, K>(options);
}