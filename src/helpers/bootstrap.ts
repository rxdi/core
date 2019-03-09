
import 'reflect-metadata';

import { Container } from '../container';
import { BootstrapService } from '../services/bootstrap/bootstrap.service';
import { ConfigModel } from '../services/config/config.model';
import { exitHandlerInit } from './exit-handler';
import { Observable } from 'rxjs';
import { ModuleArguments } from '../decorators/module/module.interfaces';

exitHandlerInit();

const bootstrapService = Container.get(BootstrapService);

export const Bootstrap = (app, config?: ConfigModel): Observable<Container> => bootstrapService.start(app, config);
export const BootstrapPromisify = (app, config?: ConfigModel): Promise<Container> => bootstrapService.start(app, config).toPromise();
export const BootstrapFramework = (app, modules: any[], config?: ConfigModel): Observable<Container> => {
    bootstrapService.configService.setConfig(config);
    modules.map(m => Container.get(m));
    return bootstrapService.start(app, config);
};

export const setup = <T, K>(
    options: ModuleArguments<T, K>,
    frameworks: any[] = [],
    bootstrapOptions?: ConfigModel
) => {
    const Module = require('../decorators/module/module.decorator').Module;

    return BootstrapFramework(Module({
        imports: options.imports || [],
        providers: options.providers || [],
        services: options.services || [],
        bootstrap: options.bootstrap || [],
        components: options.components || [],
        controllers: options.controllers || [],
        effects: options.effects || [],
        plugins: options.plugins || [],
        afterPlugins: options.afterPlugins || [],
        beforePlugins: options.beforePlugins || [],
    })(function() {}), frameworks, bootstrapOptions);
};

export const createTestBed = setup;
