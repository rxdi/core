import { Container } from '../container';
import { ModuleService, BootstrapLogger } from '../services';

const moduleService = Container.get(ModuleService);
const bootstrapLogger = Container.get(BootstrapLogger);

export function GenericConstruct(module: any, original, currentModule) {
    return function construct(constructor, args) {

        if (!module) {
            return new constructor();
        }

        if (module.imports) {
            moduleService.setImports(module, original);
        }

        if (module.services) {
            moduleService.setServices(module.services, original, currentModule);
        }

        if (module.beforePlugins && module.beforePlugins.length) {
            moduleService.setBeforePlugins(module.beforePlugins);
        }

        if (module.plugins) {
            moduleService.setPlugins(module.plugins);
        }

        if (module.afterPlugins && module.afterPlugins.length) {
            moduleService.setAfterPlugins(module.afterPlugins);
        }

        bootstrapLogger.log(`Bootstrap -> @Module('${constructor.originalName}')${bootstrapLogger.logHashes(`(${constructor.name})`)}: finished!`);

        return new constructor();
    };
}
