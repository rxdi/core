import { ExternalImporterConfig, ExternalImporterIpfsConfig } from './external-importer-config';
import { Observable } from 'rxjs';
import { CompressionService } from '../compression/compression.service';
export declare class ExternalImporter {
    private requestService;
    private fileService;
    private logger;
    compressionService: CompressionService;
    private configService;
    private npmService;
    defaultProvider: string;
    defaultNamespaceFolder: string;
    defaultOutputFolder: string;
    defaultPackageJsonFolder: string;
    defaultTypescriptConfigJsonFolder: string;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    encryptFile(fileFullPath: string): any;
    decryptFile(fileFullPath: string): any;
    isWeb(): boolean;
    loadTypescriptConfigJson(): any;
    addNamespaceToTypeRoots(namespace: string): Observable<boolean>;
    writeTypescriptConfigFile(file: any): void;
    loadPackageJson(): any;
    isModulePresent(hash: any): number;
    filterUniquePackages(): number;
    defaultIpfsConfig(): {
        provider: string;
        dependencies: any[];
    }[];
    addPackageToJson(hash: string): void;
    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<any[]>;
    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<any>;
    private combineDependencies;
    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
    downloadTypings(moduleLink: string, folder: any, fileName: any, config: ExternalImporterConfig): Observable<{}>;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
