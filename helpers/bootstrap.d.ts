import 'reflect-metadata';
import { ConfigModel } from '../services/config/config.model';
import { Observable } from 'rxjs';
export declare const Bootstrap: (app: any, config?: ConfigModel) => Observable<any>;
export declare const BootstrapPromisify: (app: any, config?: ConfigModel) => Promise<any>;
export declare const BootstrapFramework: (app: any, modules: any[], config?: ConfigModel) => Observable<any>;
