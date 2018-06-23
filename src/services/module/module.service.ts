import { Container, Service } from '../../container';
import { LazyFactory } from '../lazy-factory/lazy-factory.service';
import { PluginService } from '../plugin/plugin.service';
import { ServiceArgumentsInternal, Metadata } from '../../decorators/module/module.interfaces';
import { ExternalImporter } from '../external-importer';
import { of } from 'rxjs';
import { Injector } from '../../decorators/injector/injector.decorator';

@Service()
export class ModuleService {

    @Injector(LazyFactory) private lazyFactoryService: LazyFactory;
    @Injector(PluginService) private pluginService: PluginService;
    @Injector(ExternalImporter) private externalImporter: ExternalImporter;

    setServices(services: ServiceArgumentsInternal[], original: { metadata: Metadata }, currentModule) {
        services.forEach(service => {
            this.validateServices(service, original);

            service.deps = service.deps || [];

            if (service.provide && service.provide.constructor === Function) {
                service.provide = service.provide['name'];
            }

            if (service.deps.length) {
                service.deps = service.deps.map(dep => Container.get(dep));
            }

            if (service.provide && service.useFactory) {
                const factory = service.useFactory;
                service.useFactory = () => factory(...service.deps);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, service.useFactory());
                } else {
                    Container.set(service.provide, service.useFactory());
                }
            } else if (service.provide && service.useDynamic) {
                const factory = this.externalImporter.importModule(service.useDynamic);
                this.lazyFactoryService.setLazyFactory(service.provide, factory);
            } else if (service.provide && service.useClass && service.useClass.constructor === Function) {
                const currentClass = new service.useClass(...service.deps);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, of(currentClass));
                } else {
                    Container.get(service.useClass);
                }
            } else if (service.provide && service.useValue) {
                Container.set(service.provide, service.useValue);
                if (service.lazy) {
                    this.lazyFactoryService.setLazyFactory(service.provide, of(Container.get(service.provide)));
                }
            }
            else {
                currentModule.putItem({
                    data: service,
                    key: service.name
                });
            }
        });
    }

    setPlugins(plugins, currentModule) {

        plugins.forEach(plugin =>{
            currentModule.putItem({
                data: plugin,
                key: plugin.name
            });
            this.pluginService.register(plugin);
        });
    }

    setAfterPlugins(plugins) {
        plugins.forEach(plugin => this.pluginService.registerAfter(plugin));
    }

    setBeforePlugins(plugins) {
        plugins.forEach(plugin => this.pluginService.registerBefore(plugin));
    }

    validateImports(m, original: { metadata: Metadata }) {
        if (m.metadata.type !== 'module') {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1)} '${m.originalName}' provided, where expected class decorated with '@Module' instead,
            
            -> @Hint: please provide class with @Module decorator or remove ${m.originalName} from imports
            `);
        }
    }

    validateServices(m, original: { metadata: Metadata }) {
        if (!m) {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: ${original.metadata.moduleName}
            -> @Module hash: ${original.metadata.moduleHash}
                --> Maybe you forgot to import some service inside ${original.metadata.moduleName} ?

                Hint: run ts-lint again, looks like imported service is undefined or null inside ${original.metadata.moduleName}
            `);
        }
        if (m.provide) {
            return;
        }
        if (m.metadata.type !== 'service') {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1)} '${m.metadata.moduleName}' provided, where expected class decorated with '@Service' instead,
            
            -> @Hint: please provide class with @Service decorator or remove ${m.metadata.moduleName} from services
            `);
        }
    }

    setImports(module, original: { metadata: Metadata }) {
        module.imports.forEach((m: any) => {
            this.validateImports(m, original);
            if (!m) {
                throw new Error('Missing import module');
            } else {
                Container.get(m);
            }
        });
    }

}