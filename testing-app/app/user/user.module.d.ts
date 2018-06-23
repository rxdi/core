import { PluginInterface } from '../../../container/decorators/Plugin';
export declare class TestHapiPlugin implements PluginInterface {
    constructor();
    register(): Promise<void>;
    handler(request: any, h: any): Promise<string>;
}
export declare class UserModule {
}
