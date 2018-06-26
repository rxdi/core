import 'reflect-metadata';
import { ConfigModel } from '../services/config/config.model';
import { Observable } from 'rxjs';
export declare const Bootstrap: (app: any, config?: ConfigModel) => Observable<boolean>;
export declare const BootstrapPromisify: (app: any, config?: ConfigModel) => Promise<boolean>;
export declare const BootstrapFramework: (app: any, modules: any[], config?: ConfigModel) => Observable<boolean>;
