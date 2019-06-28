export interface PluginInterface {
    name?: string;
    version?: string;
    register(server?: any, options?: any): void;
    handler?(request: any, h: any): any;
}
export declare function Plugin<T, K extends keyof T>(options?: any): Function;
