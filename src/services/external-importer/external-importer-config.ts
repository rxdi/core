import { Config } from './external-importer-systemjs';

export class ExternalImporterConfig {
    link: string;
    fileName: string;
    typings?: string;
    namespace: string;
    extension: string;
    SystemJsConfig?: Config;
    outputFolder?: string | '/node_modules/';
}