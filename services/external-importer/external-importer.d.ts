import { ExternalImporterConfig, ExternalImporterIpfsConfig } from './external-importer-config';
import { Observable } from 'rxjs';
import { CompressionService } from '../compression/compression.service';
export declare class ExternalImporter {
    private requestService;
    private fileService;
    private logger;
    compressionService: CompressionService;
    private configService;
    defaultProvider: string;
    defaultNamespaceFolder: string;
    defaultOutputFolder: string;
    defaultPackageJsonFolder: string;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    encryptFile(fileFullPath: string): any;
    decryptFile(fileFullPath: string): any;
    isWeb(): boolean;
    loadPackageJson(): any;
    isModulePresent(hash: any): number;
    filterUniquePackages(): number;
    defaultIpfsConfig(): {
        provider: string;
        dependencies: any[];
    }[];
    addPackageToJson(hash: string): void;
    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<any[]>;
    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<string>;
    private combineDependencies(dependencies, config);
    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
    downloadTypings(moduleLink: string): Observable<any>;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
