#!/usr/bin/env node
import { Container } from '../container/Container';
import { ExternalImporter } from '../services/external-importer/external-importer';
import { FileService } from '../services/file/file.service';
import { ExternalImporterIpfsConfig } from '../services/external-importer/external-importer-config';
import { ConfigService } from '../services/config/config.service';
import { Observable, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';


const externalImporter = Container.get(ExternalImporter);
export interface PackagesConfig {
    dependencies: string[];
    provider: string;
}

export const loadDeps = (jsonIpfs: PackagesConfig) => {
    if (!jsonIpfs) {
        throw new Error('Missing ipfs config!');
    }
    if (!jsonIpfs.provider) {
        throw new Error('Missing ipfsProvider package.json');
    }
    jsonIpfs.dependencies = jsonIpfs.dependencies || [];

    return jsonIpfs.dependencies.map(hash => {
        return { hash, provider: jsonIpfs.provider };
    }).filter(res => !!res);
};

export const DownloadDependencies = (dependencies: ExternalImporterIpfsConfig[]): Observable<any> => {
    return Container.get(ExternalImporter).downloadIpfsModules(dependencies);
};


if (process.argv.toString().includes('-v') || process.argv.toString().includes('--verbose')) {
    Container.get(ConfigService).setConfig({ logger: { logging: true, hashes: true, date: true, exitHandler: true, fileService: true } });
}

const fileService = Container.get(FileService);

if (process.argv[2] === 'install' || process.argv[2] === 'i') {

    let provider = 'https://ipfs.io/ipfs/';
    let hash = '';
    let json: PackagesConfig[];
    let modulesToDownload = [];

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
        modulesToDownload = [DownloadDependencies(loadDeps({ provider, dependencies: [hash] }))];
    }

    if (!hash && fileService.isPresent(`${process.cwd() + `/${process.argv[3]}`}`)) {
        json = require(`${process.cwd() + `/${process.argv[3]}`}`).ipfs;
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/package.json'}`)) {
        json = require(`${process.cwd() + '/package.json'}`).ipfs;
    }

    if (!hash && fileService.isPresent(`${process.cwd() + '/.rxdi.json'}`)) {
        json = require(`${process.cwd() + '/.rxdi.json'}`).ipfs;
    }
    json = json || [];
    modulesToDownload = [...modulesToDownload, ...json.map(json => DownloadDependencies(loadDeps(json)))];
    combineLatest(modulesToDownload)
        .pipe(
            tap(() => hash ? Container.get(ExternalImporter).addPackageToJson(hash) : null),
            tap(() => externalImporter.filterUniquePackages())
        )
        .subscribe((c) => {

            console.log(JSON.stringify(c, null, 2), '\nModules installed!');
        }, e => console.error(e));
}
