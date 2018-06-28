import { Metadata, DecoratorType } from '../../../decorators/module/module.interfaces';
export declare class ModuleValidators {
    validateEmpty(m: any, original: {
        metadata: Metadata;
    }, type: DecoratorType): void;
    genericWrongPluggableError(m: any, original: {
        metadata: Metadata;
    }, type: DecoratorType): void;
    validateImports(m: any, original: {
        metadata: Metadata;
    }): void;
    validateServices(m: any, original: {
        metadata: Metadata;
    }): void;
    validatePlugin(m: any, original: {
        metadata: Metadata;
    }): void;
    validateController(m: any, original: {
        metadata: Metadata;
    }): void;
    validateEffect(m: any, original: {
        metadata: Metadata;
    }): void;
    validateComponent(m: any, original: {
        metadata: Metadata;
    }): void;
}
