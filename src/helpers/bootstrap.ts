import 'reflect-metadata';

import { Container } from '../container';
import { BootstrapService } from '../services/bootstrap/bootstrap.service';
import { ConfigModel } from '../services/config/config.model';
import { exitHandlerInit } from './exit-handler';
import { Observable } from 'rxjs';
import { ModuleArguments } from '../decorators/module/module.interfaces';
import { ObservableContainer } from '../container/observable-interface';

exitHandlerInit();

const bootstrapService = Container.get(BootstrapService);

export const Bootstrap = (app, config?: ConfigModel): Observable<ObservableContainer> =>
  bootstrapService.start(app, config) as never;
export const BootstrapPromisify = (
  app,
  config?: ConfigModel
): Promise<ObservableContainer> => bootstrapService.start(app, config).toPromise() as never;
export const BootstrapFramework = (
  app,
  modules: any[],
  config?: ConfigModel
): Observable<ObservableContainer> => {
  bootstrapService.configService.setConfig(config);
  modules.map(m => Container.get(m));
  return bootstrapService.start(app, config) as never;
};

export const setup = <T, K>(
  options: ModuleArguments<T, K>,
  frameworks: any[] = [],
  bootstrapOptions?: ConfigModel
) => {
  const Module = require('../decorators/module/module.decorator').Module;

  return BootstrapFramework(
    Module({
      imports: options.imports || [],
      providers: options.providers || [],
      services: options.services || [],
      bootstrap: options.bootstrap || [],
      components: options.components || [],
      controllers: options.controllers || [],
      effects: options.effects || [],
      plugins: options.plugins || [],
      afterPlugins: options.afterPlugins || [],
      beforePlugins: options.beforePlugins || []
    })(function() {}),
    frameworks,
    bootstrapOptions
  );
};

export const createTestBed = setup;
