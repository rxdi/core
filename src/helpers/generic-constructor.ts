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
            moduleService.setImports(module.imports, original);
        }

        if (module.services) {
            moduleService.setServices(module.services, original, currentModule);
        }

        if (module.controllers) {
            moduleService.setControllers(module.controllers, original, currentModule);
        }

        if (module.effects) {
            moduleService.setEffects(module.effects, original, currentModule);
        }


        if (module.components) {
            moduleService.setComponents(<any>module.components, original, currentModule);
        }

        if (module.beforePlugins) {
            moduleService.setBeforePlugins(module.beforePlugins, original, currentModule);
        }

        if (module.plugins) {
            moduleService.setPlugins(module.plugins, original, currentModule);
        }

        if (module.afterPlugins) {
            moduleService.setAfterPlugins(module.afterPlugins, original, currentModule);
        }

        bootstrapLogger.log(`Bootstrap -> @Module('${constructor.originalName}')${bootstrapLogger.logHashes(`(${constructor.name})`)}: finished!`);

        return new constructor();
    };
}
