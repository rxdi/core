#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../container/Container");
const external_importer_1 = require("../services/external-importer/external-importer");
const file_service_1 = require("../services/file/file.service");
const config_service_1 = require("../services/config/config.service");
exports.loadDeps = (currentPackage, dependencies) => {
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
exports.DownloadDependencies = (dependencies) => {
    return Container_1.Container.get(external_importer_1.ExternalImporter).downloadIpfsModules(dependencies);
};
if (process.argv.toString().includes('-v') || process.argv.toString().includes('--verbose')) {
    Container_1.Container.get(config_service_1.ConfigService).setConfig({ logger: { logging: true, hashes: true, date: true, exitHandler: true, fileService: true } });
}
const fileService = Container_1.Container.get(file_service_1.FileService);
if (process.argv[2] === 'install' || process.argv[2] === 'i') {
    const dependencies = [];
    let provider = 'https://ipfs.io/ipfs/';
    let hash = '';
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
        exports.loadDeps({ provider, dependencies: [hash] }, dependencies);
    }
    if (!hash && fileService.isPresent(`${process.cwd() + `/${process.argv[3]}`}`)) {
        const customJson = require(`${process.cwd() + `/${process.argv[3]}`}`).ipfs;
        exports.loadDeps(customJson, dependencies);
    }
    if (!hash && fileService.isPresent(`${process.cwd() + '/package.json'}`)) {
        const ipfsConfig = require(`${process.cwd() + '/package.json'}`).ipfs;
        if (ipfsConfig) {
            exports.loadDeps(ipfsConfig, dependencies);
        }
    }
    if (!hash && fileService.isPresent(`${process.cwd() + '/.rxdi.json'}`)) {
        const rxdiJson = require(`${process.cwd() + '/.rxdi.json'}`).ipfs;
        exports.loadDeps(rxdiJson, dependencies);
    }
    exports.DownloadDependencies(dependencies).subscribe(() => console.log(JSON.stringify(dependencies, null, 2), '\nModules installed!'));
}
