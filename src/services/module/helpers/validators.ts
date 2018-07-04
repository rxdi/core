import { Service } from '../../../container';
import { Metadata, DecoratorType } from '../../../decorators/module/module.interfaces';

@Service()
export class ModuleValidators {

    validateEmpty(m, original: { metadata: Metadata }, type: DecoratorType) {
        if (!m) {
            const requiredType = type.charAt(0).toUpperCase() + type.slice(1);
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: ${original.metadata.moduleName}
            -> @Module hash: ${original.metadata.moduleHash}
                --> Maybe you forgot to import some ${requiredType} inside ${original.metadata.moduleName} ?

                Hint: run ts-lint again, looks like imported ${requiredType} is undefined or null inside ${original.metadata.moduleName}
            `);
        }
    }

    genericWrongPluggableError(m, original: { metadata: Metadata }, type: DecoratorType) {
        if (m.metadata.type !== type) {
            const moduleType = m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1);
            const requiredType = type.charAt(0).toUpperCase() + type.slice(1);
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${moduleType} '${m.metadata.moduleName}' provided, where expected class decorated with '@${requiredType}' instead,
            -> @Hint: please provide class with @Service decorator or remove ${m.metadata.moduleName} class
            `);
        }
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
        this.validateEmpty(m, original, 'service');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'service');
    }

    validatePlugin(m, original: { metadata: Metadata }) {
        this.validateEmpty(m, original, 'plugin');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'plugin');
    }

    validateController(m, original: { metadata: Metadata }) {
        this.validateEmpty(m, original, 'controller');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'controller');
    }

    validateEffect(m, original: { metadata: Metadata }) {
        this.validateEmpty(m, original, 'effect');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'effect');
    }

    validateComponent(m, original: { metadata: Metadata }) {
        this.validateEmpty(m, original, 'component');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'component');
    }
}