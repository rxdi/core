import { of } from 'rxjs';
import { Container, Service } from '../../container';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { PluginService } from '../plugin/plugin.service';
import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
import { ExternalImporter } from '../external-importer';
import { Injector } from '../../decorators/injector/injector.decorator';
import { ModuleValidators } from './helpers/validators';
import { constructorWatcherService, ConstructorWatcherService } from '../constructor-watcher/constructor-watcher';
import { ControllersService } from '../controllers/controllers.service';
import { EffectsService } from '../effect/effect.service';
import { ComponentsService } from '../components/components.service';
import { BootstrapsServices } from '../bootstraps/bootstraps.service';
import { ServicesService } from '../services/services.service';

@Service()
export class ModuleService {

    public watcherService: ConstructorWatcherService = constructorWatcherService;

    @Injector(LazyFactory) private lazyFactoryService: LazyFactory;
    @Injector(PluginService) private pluginService: PluginService;
    @Injector(ComponentsService) private componentsService: ComponentsService;
    @Injector(ControllersService) private controllersService: ControllersService;
    @Injector(EffectsService) private effectsService: EffectsService;
    @Injector(BootstrapsServices) private bootstraps: BootstrapsServices;
    @Injector(ExternalImporter) private externalImporter: ExternalImporter;
    @Injector(ModuleValidators) private validators: ModuleValidators;
    @Injector(ServicesService) private servicesService: ServicesService;

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
                this.servicesService.register(service);
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
        const factory = this.externalImporter.importModule(service.useDynamic, service.provide);
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

    setControllers(controllers: any[], original, currentModule) {
        controllers.forEach(controller => {
            this.validators.validateController(controller, original);
            currentModule.putItem({
                data: controller,
                key: controller.name
            });
            this.controllersService.register(controller);
        });
    }

    setEffects(effects: any[], original, currentModule) {
        effects.forEach(effect => {
            this.validators.validateEffect(effect, original);
            currentModule.putItem({
                data: effect,
                key: effect.name
            });
            this.effectsService.register(effect);
        });
    }

    setComponents(components: any[], original, currentModule) {
        components.forEach(component => {
            this.validators.validateComponent(component, original);
            currentModule.putItem({
                data: component,
                key: component.name
            });
            this.componentsService.register(component);
        });
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

    setBootstraps(bootstraps, original: { metadata: Metadata }, currentModule) {
        bootstraps.forEach(bootstrap => {
            this.validators.validateEmpty(bootstrap, original, bootstrap['metadata']['type']);
            currentModule.putItem({
                data: bootstrap,
                key: bootstrap.name
            });
            this.bootstraps.register(bootstrap);
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

    setImports(imports, original: { metadata: Metadata }) {
        imports.forEach((m: any) => {
            this.validators.validateImports(m, original);
            if (!m) {
                throw new Error('Missing import module');
            } else {
                Container.get(m);
            }
        });
    }

}