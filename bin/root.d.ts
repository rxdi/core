import { ExternalImporterIpfsConfig } from 'services';
import { Observable } from 'rxjs';
export interface PackagesConfig {
    dependencies: string[];
    ipfsProvider: string;
}
export declare const loadDeps: (currentPackage: PackagesConfig, dependencies: ExternalImporterIpfsConfig[]) => void;
export declare const DownloadDependencies: (dependencies: ExternalImporterIpfsConfig[]) => Observable<any>;
