import { ModuleArguments } from '../module/module.interfaces';
export declare function Module<T, K extends keyof T>(module?: ModuleArguments<T, K>): Function;
