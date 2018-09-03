import { NpmPackageConfig } from '../external-importer';
import { BehaviorSubject } from 'rxjs';
export declare class NpmService {
    packagesToDownload: BehaviorSubject<NpmPackageConfig[]>;
    command: string;
    setPackages(packages: NpmPackageConfig[]): void;
    preparePackages(): void;
    installPackages(): void;
}
