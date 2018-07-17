#!/usr/bin/env node
import { Container } from '../container/Container';
import { ExternalImporter } from '../services/external-importer/external-importer';
import { FileService } from '../services/file/file.service';
import { ExternalImporterIpfsConfig } from 'services';
import { Observable } from 'rxjs';

const fileService = Container.get(FileService);

export interface PackagesConfig {
    dependencies: string[];
    ipfsProvider: string;
}

export const loadDeps = (currentPackage: PackagesConfig, dependencies: ExternalImporterIpfsConfig[]) => {
    if (!currentPackage) {
        throw new Error('Missing ipfs config!');
    }
    if (!currentPackage.ipfsProvider) {
        throw new Error('Missing ipfsProvider package.json');
    }
    const ipfsProvider = currentPackage.ipfsProvider;
    if (currentPackage.dependencies) {
        currentPackage.dependencies.map(hash => dependencies.push({ hash, ipfsProvider }));
    }
};

export const DownloadDependencies = (dependencies: ExternalImporterIpfsConfig[]): Observable<any> => {
    return Container.get(ExternalImporter).downloadIpfsModules(dependencies);
};

if (process.argv[2] === 'install') {
    const dependencies: ExternalImporterIpfsConfig[] = [];
    let ipfsProvider = '';
    let hash = '';
    process.argv.forEach(function (val, index, array) {
        if (index === 3 && val.includes('--hash=')) {
            hash = val.split('--hash=')[1];
        }
        if (index === 4 && val.includes('--provider=')) {
            ipfsProvider = val.split('--provider=')[1];
        }
    });

    if (hash) {
        loadDeps({ ipfsProvider: ipfsProvider, dependencies: [hash] }, dependencies);
    }

    if (!hash && fileService.isPresent(`${process.cwd() + `/${process.argv[3]}`}`)) {
        const customJson: PackagesConfig = require(`${process.cwd() + `/${process.argv[3]}`}`);
        loadDeps(customJson, dependencies);
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/package.json'}`)) {
        const ipfsConfig: PackagesConfig = require(`${process.cwd() + '/package.json'}`).ipfs;
        if (ipfsConfig) {
            loadDeps(ipfsConfig, dependencies);
        }
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/.rxdi.json'}`)) {
        const rxdiJson: PackagesConfig = require(`${process.cwd() + '/.rxdi.json'}`);
        loadDeps(rxdiJson, dependencies);
    }

    DownloadDependencies(dependencies).subscribe(() => console.log(JSON.stringify(dependencies, null, 2), '\nModules installed!'));
}
