import { ConfigModel } from '../services/config/config.model';
import { ModuleArguments } from '../decorators/module/module.interfaces';
export declare const setup: <T, K>(options: ModuleArguments<T, K>, frameworks?: any[], bootstrapOptions?: ConfigModel) => import("rxjs/internal/Observable").Observable<import("../container/Container").Container>;
export declare const createTestBed: <T, K>(options: ModuleArguments<T, K>, frameworks?: any[], bootstrapOptions?: ConfigModel) => import("rxjs/internal/Observable").Observable<import("../container/Container").Container>;
