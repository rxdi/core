/// <reference types="node" />
import { BehaviorSubject } from 'rxjs';
import childProcess = require('child_process');
export declare class NpmService {
    packagesToDownload: BehaviorSubject<any[]>;
    packages: string[];
    child: childProcess.ChildProcess;
    setPackages(packages: any[]): void;
    preparePackages(): void;
    installPackages(): Promise<unknown>;
}
