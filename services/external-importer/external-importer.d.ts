import { ExternalImporterConfig } from './external-importer-config';
import { Observable } from 'rxjs';
import { RequestService } from '../request';
import { FileService } from '../file';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
export declare class ExternalImporter {
    requestService: RequestService;
    fileService: FileService;
    logger: BootstrapLogger;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    importModule(config: ExternalImporterConfig): Observable<Function>;
}
