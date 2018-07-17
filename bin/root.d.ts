import { ExternalImporterIpfsConfig } from '../services/external-importer/external-importer-config';
import { Observable } from 'rxjs';
export interface PackagesConfig {
    dependencies: string[];
    provider: string;
}
export declare const loadDeps: (currentPackage: PackagesConfig, dependencies: ExternalImporterIpfsConfig[]) => void;
export declare const DownloadDependencies: (dependencies: ExternalImporterIpfsConfig[]) => Observable<any>;
