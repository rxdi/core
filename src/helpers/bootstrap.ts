import 'reflect-metadata';
import { Container } from '../container';
import { BootstrapService } from '../services/bootstrap/bootstrap.service';
import { ConfigModel } from '../services/config/config.model';
import { exitHandlerInit } from './exit-handler';
import { Observable } from 'rxjs';

exitHandlerInit();

const bootstrapService = Container.get(BootstrapService);

export const Bootstrap = (app, config?: ConfigModel): Observable<boolean> => bootstrapService.start(app, config);
export const BootstrapPromisify = (app, config?: ConfigModel): Promise<boolean> => bootstrapService.start(app, config).toPromise();
