#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../container/Container");
const external_importer_1 = require("../services/external-importer/external-importer");
const file_service_1 = require("../services/file/file.service");
const config_service_1 = require("../services/config/config.service");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const externalImporter = Container_1.Container.get(external_importer_1.ExternalImporter);
exports.loadDeps = (jsonIpfs) => {
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
exports.DownloadDependencies = (dependencies) => {
    return Container_1.Container.get(external_importer_1.ExternalImporter).downloadIpfsModules(dependencies);
};
if (process.argv.toString().includes('-v') || process.argv.toString().includes('--verbose')) {
    Container_1.Container.get(config_service_1.ConfigService).setConfig({ logger: { logging: true, hashes: true, date: true, exitHandler: true, fileService: true } });
}
const fileService = Container_1.Container.get(file_service_1.FileService);
if (process.argv[2] === 'install' || process.argv[2] === 'i') {
    let provider = 'https://ipfs.io/ipfs/';
    let hash = '';
    let json;
    let modulesToDownload = [];
    process.argv.forEach(function (val, index, array) {
        if (index === 3) {
            if (val.length === 46) {
                hash = val;
            }
            else if (val.includes('--hash=')) {
                hash = val.split('--hash=')[1];
            }
            else if (val.includes('-h=')) {
                hash = val.split('-h=')[1];
            }
        }
        if (index === 4) {
            if (val.includes('--provider=')) {
                provider = val.split('--provider=')[1];
            }
            else if (val.includes('http')) {
                provider = val;
            }
            else if (val.includes('-p=')) {
                provider = val.split('-p=')[1];
            }
        }
    });
    if (hash) {
        modulesToDownload = [exports.DownloadDependencies(exports.loadDeps({ provider, dependencies: [hash] }))];
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
    modulesToDownload = [...modulesToDownload, ...json.map(json => exports.DownloadDependencies(exports.loadDeps(json)))];
    rxjs_1.combineLatest(modulesToDownload)
        .pipe(operators_1.tap(() => hash ? Container_1.Container.get(external_importer_1.ExternalImporter).addPackageToJson(hash) : null), operators_1.tap(() => externalImporter.filterUniquePackages()))
        .subscribe((c) => {
        console.log(JSON.stringify(c, null, 2), '\nModules installed!');
    }, e => console.error(e));
}
