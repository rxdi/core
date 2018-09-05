import { Config } from './external-importer-systemjs';
export declare class ExternalImporterConfig {
    link: string;
    fileName?: string;
    typings?: string;
    typingsFileName?: string;
    namespace?: string;
    extension?: string;
    crypto?: {
        cyperKey: string;
        cyperIv: string;
        algorithm: string;
    };
    SystemJsConfig?: Config;
    outputFolder?: string | '/node_modules/';
}
export declare class ExternalImporterIpfsConfig {
    provider: string;
    hash: string;
}
export interface NpmPackageConfig {
    name: string;
    version: string;
}
export interface ExternalModuleConfiguration {
    name: string;
    version: string;
    typings: string;
    module: string;
    dependencies?: Array<any>;
    packages?: NpmPackageConfig[];
}
