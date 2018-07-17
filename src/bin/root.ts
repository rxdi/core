#!/usr/bin/env node
import { Container } from '../container/Container';
import { ExternalImporter } from '../services/external-importer/external-importer';
import { FileService } from '../services/file/file.service';
import { ExternalImporterIpfsConfig } from '../services/external-importer/external-importer-config';
import { ConfigService } from '../services/config/config.service';
import { Observable } from 'rxjs';

export interface PackagesConfig {
    dependencies: string[];
    provider: string;
}

export const loadDeps = (currentPackage: PackagesConfig, dependencies: ExternalImporterIpfsConfig[]) => {
    if (!currentPackage) {
        throw new Error('Missing ipfs config!');
    }
    if (!currentPackage.provider) {
        throw new Error('Missing ipfsProvider package.json');
    }
    const provider = currentPackage.provider;
    if (currentPackage.dependencies) {
        currentPackage.dependencies.map(hash => dependencies.push({ hash, provider }));
    }
};

export const DownloadDependencies = (dependencies: ExternalImporterIpfsConfig[]): Observable<any> => {
    return Container.get(ExternalImporter).downloadIpfsModules(dependencies);
};


if (process.argv.toString().includes('-v') || process.argv.toString().includes('--verbose')) {
    Container.get(ConfigService).setConfig({ logger: { logging: true, hashes: true, date: true, exitHandler: true, fileService: true } })
}

const fileService = Container.get(FileService);

if (process.argv[2] === 'install' || process.argv[2] === 'i') {
    const dependencies: ExternalImporterIpfsConfig[] = [];
    let provider = 'https://ipfs.io/ipfs/';
    let hash = '';

    process.argv.forEach(function (val, index, array) {
        if (index === 3) {
            if (val.length === 46) {
                hash = val;
            } else if (val.includes('--hash=')) {
                hash = val.split('--hash=')[1];
            } else if (val.includes('-h=')) {
                hash = val.split('-h=')[1];
            }
        }
        if (index === 4) {
            if (val.includes('--provider=')) {
                provider = val.split('--provider=')[1];
            } else if (val.includes('http')) {
                provider = val;
            } else if (val.includes('-p=')) {
                provider = val.split('-p=')[1];
            }

        }
    });
    if (hash) {
        loadDeps({ provider, dependencies: [hash] }, dependencies);
    }

    if (!hash && fileService.isPresent(`${process.cwd() + `/${process.argv[3]}`}`)) {
        const customJson: PackagesConfig = require(`${process.cwd() + `/${process.argv[3]}`}`).ipfs;
        loadDeps(customJson, dependencies);
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/package.json'}`)) {
        const ipfsConfig: PackagesConfig = require(`${process.cwd() + '/package.json'}`).ipfs;
        if (ipfsConfig) {
            loadDeps(ipfsConfig, dependencies);
        }
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/.rxdi.json'}`)) {
        const rxdiJson: PackagesConfig = require(`${process.cwd() + '/.rxdi.json'}`).ipfs;
        loadDeps(rxdiJson, dependencies);
    }

    DownloadDependencies(dependencies).subscribe(() => console.log(JSON.stringify(dependencies, null, 2), '\nModules installed!'));
}
