import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
export declare class ServicesService {
    private services;
    register(plugin: any): void;
    getServices(): ServiceArgumentsInternal[];
}
