import { ExternalImporterConfig } from './external-importer-config';
import { Observable } from 'rxjs';
import { RequestService } from '../request';
import { FileService } from '../file';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { CompressionService } from '../compression/compression.service';
export declare class ExternalImporter {
    requestService: RequestService;
    fileService: FileService;
    logger: BootstrapLogger;
    compressionService: CompressionService;
    private configService;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    encryptFile(fileFullPath: string): any;
    decryptFile(fileFullPath: string): any;
    isWeb(): boolean;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
