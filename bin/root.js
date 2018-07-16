"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../container/Container");
const external_importer_1 = require("../services/external-importer/external-importer");
const file_service_1 = require("../services/file/file.service");
const fileService = Container_1.Container.get(file_service_1.FileService);
exports.loadDeps = (currentPackage, dependencies) => {
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
exports.DownloadDependencies = (dependencies) => {
    return Container_1.Container.get(external_importer_1.ExternalImporter).downloadIpfsModules(dependencies);
};
if (process.argv[2] === 'install') {
    const dependencies = [];
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
        exports.loadDeps({ ipfsProvider: ipfsProvider, dependencies: [hash] }, dependencies);
    }
    if (!hash && fileService.isPresent(`${process.cwd() + `/${process.argv[3]}`}`)) {
        const customJson = require(`${process.cwd() + `/${process.argv[3]}`}`);
        exports.loadDeps(customJson, dependencies);
    }
    if (!hash && fileService.isPresent(`${process.cwd() + '/package.json'}`)) {
        const ipfsConfig = require(`${process.cwd() + '/package.json'}`).ipfs;
        if (ipfsConfig) {
            exports.loadDeps(ipfsConfig, dependencies);
        }
    }
    if (!hash && fileService.isPresent(`${process.cwd() + '/.rxdi.json'}`)) {
        const rxdiJson = require(`${process.cwd() + '/.rxdi.json'}`);
        exports.loadDeps(rxdiJson, dependencies);
    }
    exports.DownloadDependencies(dependencies).subscribe(() => console.log(JSON.stringify(dependencies, null, 2), '\nModules installed!'));
}
