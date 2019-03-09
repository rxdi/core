import { DecoratorType, ServiceArgumentsInternal } from '../../../decorators/module/module.interfaces';
export declare class ModuleValidators {
    validateEmpty(m: any, original: ServiceArgumentsInternal, type: DecoratorType): void;
    genericWrongPluggableError(m: any, original: ServiceArgumentsInternal, type: DecoratorType): void;
    validateImports(m: any, original: ServiceArgumentsInternal): void;
    validateServices(m: any, original: ServiceArgumentsInternal): void;
    validatePlugin(m: any, original: ServiceArgumentsInternal): void;
    validateController(m: any, original: ServiceArgumentsInternal): void;
    validateEffect(m: any, original: ServiceArgumentsInternal): void;
    validateComponent(m: any, original: ServiceArgumentsInternal): void;
}
