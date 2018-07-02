import 'reflect-metadata';
import { ConfigModel } from '../services/config/config.model';
import { Observable } from 'rxjs';
import { PluginManager } from '../services/plugin-manager/plugin-manager';
export declare const Bootstrap: (app: any, config?: ConfigModel) => Observable<PluginManager>;
export declare const BootstrapPromisify: (app: any, config?: ConfigModel) => Promise<PluginManager>;
export declare const BootstrapFramework: (app: any, modules: any[], config?: ConfigModel) => Observable<PluginManager>;
