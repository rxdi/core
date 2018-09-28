#!/usr/bin/env node
import { Container } from '../container/Container';
import { ExternalImporter } from '../services/external-importer/external-importer';
import { FileService } from '../services/file/file.service';
import { ExternalImporterIpfsConfig } from '../services/external-importer/external-importer-config';
import { ConfigService } from '../services/config/config.service';
import { Observable, combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

const includes = (i: string) => process.argv.toString().includes(i);

const externalImporter = Container.get(ExternalImporter);
const fileService = Container.get(FileService);
let p = null;

if (includes('--local-node')) {
    p = externalImporter.getProvider('local');
}

if (includes('--cloudflare')) {
    p = externalImporter.getProvider('cloudflare');
}

if (includes('--infura')) {
    p = externalImporter.getProvider('infura');
}

if (includes('--ipfs')) {
    p = externalImporter.getProvider('main-ipfs-node');
}

externalImporter.defaultProvider = p || externalImporter.defaultProvider;
let provider = externalImporter.defaultProvider;
let hash = '';
let modulesToDownload = [];
let customConfigFile;
let packageJsonConfigFile;
let rxdiConfigFile;
let json: PackagesConfig[];
// let interval;

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

if (process.argv[2] === 'install' || process.argv[2] === 'i') {

    process.argv.forEach((val, index) => {
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

    customConfigFile = `${process.cwd()}/${process.argv[3]}`;
    packageJsonConfigFile = `${process.cwd()}/package.json`;
    rxdiConfigFile = `${process.cwd()}/reactive.json`;

    if (!hash && fileService.isPresent(customConfigFile)) {
        json = require(customConfigFile).ipfs;
        externalImporter.defaultJsonFolder = customConfigFile;
    }

    if (fileService.isPresent(packageJsonConfigFile)) {
        json = require(packageJsonConfigFile).ipfs;
        externalImporter.defaultJsonFolder = packageJsonConfigFile;
    }

    if (fileService.isPresent(rxdiConfigFile)) {
        json = require(rxdiConfigFile).ipfs;
        externalImporter.defaultJsonFolder = rxdiConfigFile;
    }
    console.log(`Loaded config ${externalImporter.defaultJsonFolder}`);
    console.log('Reactive ipfs modules installing...');
    if (hash) {
        modulesToDownload = [DownloadDependencies(loadDeps({ provider: p || provider, dependencies: [hash] }))];
    }
    if (!hash) {
        json = json || [];
        modulesToDownload = [...modulesToDownload, ...json.map(json => {
            json.provider = p || json.provider;
            return DownloadDependencies(loadDeps(json));
        })];
    }
    combineLatest(modulesToDownload)
        .pipe(
            tap(() => hash ? externalImporter.addPackageToJson(hash) : null),
            tap(() => externalImporter.filterUniquePackages())
        ).subscribe(
            (res) => {
                console.log('Default ipfs provider: ', p || externalImporter.defaultProvider);
                console.log(`Inside package.json default provider is ${externalImporter.defaultProvider}`);
                console.log(JSON.stringify(res, null, 2), '\nReactive ipfs modules installed!');
                // clearInterval(interval);
            },
            (e) => {
                throw new Error(e);
            }
        );
}
