/// <reference types="node" />
import { NpmPackageConfig } from '../external-importer/index';
import { BehaviorSubject } from 'rxjs';
import childProcess = require('child_process');
export declare class NpmService {
    packagesToDownload: BehaviorSubject<NpmPackageConfig[]>;
    packages: string[];
    child: childProcess.ChildProcess;
    setPackages(packages: NpmPackageConfig[]): void;
    preparePackages(): void;
    installPackages(): void;
}
