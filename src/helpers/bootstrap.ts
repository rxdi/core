import 'reflect-metadata';
import { Container } from '../container';
import { BootstrapService } from '../services/bootstrap/bootstrap.service';
import { ConfigModel } from '../services/config/config.model';
import { exitHandlerInit } from './exit-handler';
import { Observable } from 'rxjs';
import { PluginManager } from '../services/plugin-manager/plugin-manager';

exitHandlerInit();

const bootstrapService = Container.get(BootstrapService);

export const Bootstrap = (app, config?: ConfigModel): Observable<PluginManager> => bootstrapService.start(app, config);
export const BootstrapPromisify = (app, config?: ConfigModel): Promise<PluginManager> => bootstrapService.start(app, config).toPromise();
export const BootstrapFramework = (app, modules: any[], config?: ConfigModel): Observable<PluginManager> => {
    bootstrapService.configService.setConfig(config);
    modules.map(m => Container.get(m));
    return bootstrapService.start(app, config);
};