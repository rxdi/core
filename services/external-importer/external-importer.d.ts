import { ExternalImporterConfig, ExternalImporterIpfsConfig } from './external-importer-config';
import { Observable, BehaviorSubject } from 'rxjs';
import { CompressionService } from '../compression/compression.service';
import { IPFS_PROVIDERS } from './providers';
export declare class ExternalImporter {
    private requestService;
    private fileService;
    private logger;
    compressionService: CompressionService;
    private configService;
    private npmService;
    providers: BehaviorSubject<{
        name: IPFS_PROVIDERS;
        link: string;
    }[]>;
    defaultProvider: string;
    defaultNamespaceFolder: string;
    defaultOutputFolder: string;
    defaultPackageJsonFolder: string;
    defaultTypescriptConfigJsonFolder: string;
    getProvider(name: IPFS_PROVIDERS): string;
    setProviders(...args: {
        name: IPFS_PROVIDERS;
        link: string;
    }[]): void;
    importExternalModule(module: string): Observable<any>;
    validateConfig(config: ExternalImporterConfig): void;
    isWeb(): boolean;
    loadTypescriptConfigJson(): {
        compilerOptions?: {
            typeRoots?: string[];
        };
    };
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
    private writeFakeIndexIfMultiModule;
    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
    downloadTypings(moduleLink: string, folder: any, fileName: any, config: ExternalImporterConfig): Observable<{}>;
    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
}
