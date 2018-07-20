import { ExternalImporterConfig, ExternalImporterIpfsConfig } from './external-importer-config';
import { Observable } from 'rxjs';
import { CompressionService } from '../compression/compression.service';
export declare class ExternalImporter {
    private requestService;
    private fileService;
    private logger;
    compressionService: CompressionService;
    private configService;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    encryptFile(fileFullPath: string): any;
    decryptFile(fileFullPath: string): any;
    isWeb(): boolean;
    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<{}>;
    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<any>;
    private combineDependencies(dependencies, config);
    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
    downloadTypings(config: ExternalImporterConfig): Observable<any>;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
