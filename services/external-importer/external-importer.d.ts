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
    loadPackageJson(): any;
    findCurrentModule(): void;
    isModulePresent(hash: any): number;
    filterUniquePackages(): number;
    addPackageToJson(hash: string): void;
    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<any[]>;
    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<string>;
    private combineDependencies(dependencies, config);
    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
    downloadTypings(config: ExternalImporterConfig): Observable<any>;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
