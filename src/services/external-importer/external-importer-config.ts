import { Config } from './external-importer-systemjs';

export class ExternalImporterConfig {
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

export class ExternalImporterIpfsConfig {
    provider: string;
    hash: string;
}