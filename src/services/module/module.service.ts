import { Container, Service } from '../../container';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { PluginService } from '../plugin/plugin.service';
import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
import { ExternalImporter } from '../external-importer';
import { of } from 'rxjs';
import { Injector } from '../../decorators/injector/injector.decorator';
import { ModuleValidators } from './helpers/validators';
import { constructorWatcherService, ConstructorWatcherService } from '../constructor-watcher/constructor-watcher';

@Service()
export class ModuleService {
    public watcherService: ConstructorWatcherService = constructorWatcherService;
    @Injector(LazyFactory) private lazyFactoryService: LazyFactory;
    @Injector(PluginService) private pluginService: PluginService;
    @Injector(ExternalImporter) private externalImporter: ExternalImporter;
    @Injector(ModuleValidators) private validators: ModuleValidators;

    setServices(services: ServiceArgumentsInternal[], original: { metadata: Metadata }, currentModule) {
        services.forEach(service => {
            this.validators.validateServices(service, original);

            this.setInjectedDependencies(service);

            if (service.provide && service.provide.constructor === Function) {
                service.provide = service.provide['name'];
            }

            if (service.provide && service.useFactory) {
                this.setUseFactory(service);
            } else if (service.provide && service.useDynamic) {
                this.setUseDynamic(service);
            } else if (service.provide && service.useClass && service.useClass.constructor === Function) {
                this.setUseClass(service);
            } else if (service.provide && service.useValue) {
                this.setUseValue(service);
            } else {
                currentModule.putItem({ data: service, key: service.name });
            }

        });
    }

    setInjectedDependencies(service) {
        service.deps = service.deps || [];
        if (service.deps.length) {
            service.deps = service.deps.map(dep => Container.get(dep));
        }
    }

    setUseValue(service) {
        Container.set(service.provide, service.useValue);
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, of(Container.get(service.provide)));
        }
    }

    setUseClass(service) {
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, of(Container.get(service.useClass)));
        } else {
            Container.set(service.provide, Container.get(service.useClass));
        }
    }

    setUseDynamic(service) {
        const factory = this.externalImporter.importModule(service.useDynamic);
        this.lazyFactoryService.setLazyFactory(service.provide, factory);
    }

    setUseFactory(service) {
        const factory = service.useFactory;
        service.useFactory = () => factory(...service.deps);
        if (service.lazy) {
            this.lazyFactoryService.setLazyFactory(service.provide, service.useFactory());
        } else {
            Container.set(service.provide, service.useFactory());
        }
    }

    setPlugins(plugins, original: { metadata: Metadata }, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.register(plugin);
        });
    }

    setAfterPlugins(plugins, original: { metadata: Metadata }, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.registerAfter(plugin);
        });
    }

    setBeforePlugins(plugins, original: { metadata: Metadata }, currentModule) {
        plugins.forEach(plugin => {
            this.validators.validatePlugin(plugin, original);
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.registerBefore(plugin);
        });
    }

    setImports(module, original: { metadata: Metadata }) {
        module.imports.forEach((m: any) => {
            this.validators.validateImports(m, original);
            if (!m) {
                throw new Error('Missing import module');
            } else {
                Container.get(m);
            }
        });
    }

}