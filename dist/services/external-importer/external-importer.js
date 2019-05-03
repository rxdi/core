"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const request_1 = require("../request");
const file_1 = require("../file");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const compression_service_1 = require("../compression/compression.service");
const npm_service_1 = require("../npm-service/npm.service");
const providers_1 = require("./providers");
const SystemJS = require("systemjs");
let ExternalImporter = class ExternalImporter {
    constructor() {
        this.defaultJsonFolder = `${process.cwd()}/package.json`;
        this.defaultTypescriptConfigJsonFolder = `${process.cwd()}/tsconfig.json`;
        this.providers = new rxjs_1.BehaviorSubject(providers_1.IPFS_PROVIDERS);
        this.defaultProvider = this.getProvider('main-ipfs-node');
        this.defaultNamespaceFolder = '@types';
        this.defaultOutputFolder = 'node_modules';
    }
    setDefaultProvider(provider) {
        this.defaultProvider = this.getProvider(provider);
    }
    getProvider(name) {
        return this.providers.getValue().filter(p => p.name === name)[0].link;
    }
    setProviders(...args) {
        this.providers.next([...this.providers.getValue(), ...args]);
    }
    importExternalModule(module) {
        return rxjs_1.from(SystemJS.import(module));
    }
    validateConfig(config) {
        if (!config) {
            throw new Error('Bootstrap: missing config');
        }
    }
    // encryptFile(fileFullPath: string) {
    //     if (this.configService.config.experimental.crypto) {
    //         return this.compressionService.readGzipFile(fileFullPath, 'dada');
    //     } else {
    //         return of(null);
    //     }
    // }
    // decryptFile(fileFullPath: string) {
    //     if (this.configService.config.experimental.crypto) {
    //         return this.compressionService.gZipFile(fileFullPath, 'dada');
    //     } else {
    //         return of(null);
    //     }
    // }
    isWeb() {
        let value = false;
        try {
            if (window) {
                value = true;
            }
        }
        catch (e) { }
        return value;
    }
    loadTypescriptConfigJson() {
        let tsConfig = {};
        try {
            tsConfig = this.fileService.readFile(this.defaultTypescriptConfigJsonFolder);
        }
        catch (e) {
            console.error(`
            Error in loading tsconfig.json in ${this.defaultTypescriptConfigJsonFolder}
            Error: ${e}
            Fallback to creating tsconfig.json
            `);
        }
        tsConfig.compilerOptions = tsConfig.compilerOptions || {};
        tsConfig.compilerOptions.typeRoots =
            tsConfig.compilerOptions.typeRoots || [];
        return tsConfig;
    }
    addNamespaceToTypeRoots(namespace) {
        const defaultNamespace = `./${this.defaultOutputFolder}/@types/${namespace}`;
        const tsConfig = this.loadTypescriptConfigJson();
        const foundNamespace = tsConfig.compilerOptions.typeRoots.filter(t => t === defaultNamespace).length;
        if (!foundNamespace) {
            tsConfig.compilerOptions.typeRoots.push(defaultNamespace);
            this.writeTypescriptConfigFile(tsConfig);
        }
        return rxjs_1.of(true);
    }
    writeTypescriptConfigFile(file) {
        this.fileService.writeFileSync(process.cwd() + '/tsconfig.json', file);
    }
    loadPackageJson() {
        let packageJson;
        try {
            packageJson = this.fileService.readFile(this.defaultJsonFolder);
        }
        catch (e) {
            packageJson = {};
        }
        return packageJson;
    }
    loadNpmPackageJson() {
        let packageJson;
        try {
            packageJson = this.fileService.readFile(`${process.cwd()}/package.json`);
        }
        catch (e) {
            packageJson = {};
        }
        return packageJson;
    }
    prepareDependencies() {
        const file = this.loadNpmPackageJson();
        if (file.dependencies) {
            return Object.keys(file.dependencies).map(name => ({
                name,
                version: file.dependencies[name]
            }));
        }
        return [];
    }
    isModulePresent(hash) {
        const file = this.loadPackageJson();
        let ipfsConfig = file.ipfs;
        const found = [];
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        ipfsConfig.forEach(c => {
            const present = c.dependencies.filter(dep => dep === hash);
            if (present.length) {
                found.push(present[0]);
            }
        });
        return found.length;
    }
    filterUniquePackages() {
        const file = this.loadPackageJson();
        let ipfsConfig = file.ipfs;
        let dups = [];
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        ipfsConfig.forEach(c => {
            const uniq = c.dependencies
                .map(name => {
                return { count: 1, name: name };
            })
                .reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count;
                return a;
            }, {});
            const duplicates = Object.keys(uniq).filter(a => uniq[a] > 1);
            dups = [...dups, ...duplicates];
        });
        if (dups.length) {
            throw new Error(`There are packages which are with the same hash ${JSON.stringify(dups)}`);
        }
        return dups.length;
    }
    defaultIpfsConfig() {
        return [{ provider: this.defaultProvider, dependencies: [] }];
    }
    addPackageToJson(hash) {
        const file = this.loadPackageJson();
        let ipfsConfig = file.ipfs;
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        const packages = this.prepareDependencies();
        if (packages.length) {
            file.packages = packages;
        }
        if (this.isModulePresent(hash)) {
            this.logger.log(`Package with hash: ${hash} present and will not be downloaded!`);
        }
        else {
            ipfsConfig[0].dependencies.push(hash);
            file.ipfs = ipfsConfig;
        }
        this.fileService.writeFileSync(this.defaultJsonFolder, file);
    }
    downloadIpfsModules(modules) {
        const latest = modules.map(m => this.downloadIpfsModule(m));
        return rxjs_1.combineLatest(latest.length ? latest : rxjs_1.of());
    }
    downloadIpfsModuleConfig(config) {
        return this.requestService
            .get(config.provider + config.hash, config.hash)
            .pipe(operators_1.map(r => {
            if (!r) {
                throw new Error('Recieved undefined from provided address' +
                    config.provider +
                    config.hash);
            }
            let res = r;
            const metaString = '<!--meta-rxdi-ipfs-module-->';
            if (res.includes(metaString)) {
                try {
                    res = r.split(metaString)[1];
                }
                catch (e) { }
            }
            return res;
        }), operators_1.map(r => {
            let res = r;
            try {
                res = JSON.parse(r);
            }
            catch (e) { }
            return res;
        }));
    }
    combineDependencies(dependencies, config) {
        return rxjs_1.combineLatest(dependencies.length
            ? dependencies.map(h => this.downloadIpfsModule({ provider: config.provider, hash: h }))
            : rxjs_1.of(''));
    }
    writeFakeIndexIfMultiModule(folder, nameSpaceFakeIndex) {
        if (nameSpaceFakeIndex.length === 2) {
            return this.fileService.writeFileAsyncP(`${folder}${this.defaultNamespaceFolder}/${nameSpaceFakeIndex[0]}`, 'index.d.ts', '');
        }
        else {
            return rxjs_1.of(true);
        }
    }
    downloadIpfsModule(config) {
        if (!config.provider) {
            throw new Error(`Missing configuration inside ${config.hash}`);
        }
        if (!config.hash) {
            throw new Error(`Missing configuration inside ${config.provider}`);
        }
        let folder;
        let moduleLink;
        const configLink = config.provider + config.hash;
        let moduleTypings;
        let moduleName;
        let nameSpaceFakeIndex;
        let originalModuleConfig;
        let isNamespace;
        let isRegular;
        return this.downloadIpfsModuleConfig(config).pipe(operators_1.tap(res => {
            if (!res['module']) {
                console.log('Todo: create logic to load module which is not from rxdi infrastructure for now can be used useDynamic which will do the same job!');
            }
        }), operators_1.filter((res) => !!res.module), operators_1.map((externalModule) => {
            moduleName = externalModule.name;
            nameSpaceFakeIndex = moduleName.split('/');
            folder = `${process.cwd()}/${this.defaultOutputFolder}/`;
            moduleLink = `${config.provider}${externalModule.module}`;
            moduleTypings = `${config.provider}${externalModule.typings}`;
            externalModule.dependencies = externalModule.dependencies || [];
            externalModule.packages = externalModule.packages || [];
            originalModuleConfig = externalModule;
            this.npmService.setPackages(externalModule.packages);
            isNamespace = moduleName.split('/').length === 2;
            isRegular = isNamespace ? moduleName : moduleName.split('/')[0];
            this.logger.logFileService(`Package config for module ${moduleName} downloaded! ${JSON.stringify(externalModule)}`);
            return externalModule;
        }), operators_1.switchMap(externalModule => this.combineDependencies(externalModule.dependencies, config)), operators_1.switchMap(() => {
            this.logger.logFileService(`--------------------${moduleName}--------------------`);
            this.logger.logFileService(`\nDownloading... ${configLink} `);
            this.logger.logFileService(`Config: ${JSON.stringify(originalModuleConfig, null, 2)} \n`);
            return this.requestService.get(moduleLink, config.hash);
        }), operators_1.switchMap(file => this.fileService.writeFile(folder + moduleName, 'index.js', moduleName, file)), operators_1.switchMap(() => this.requestService.get(moduleTypings, config.hash)), operators_1.switchMap(file => this.fileService.writeFile(folder + `${this.defaultNamespaceFolder}/${isRegular}`, 'index.d.ts', moduleName, file)), operators_1.tap(() => {
            if (process.env.WRITE_FAKE_INDEX) {
                this.writeFakeIndexIfMultiModule(folder, nameSpaceFakeIndex);
            }
        }), operators_1.switchMap(() => this.addNamespaceToTypeRoots(moduleName.split('/')[0])), operators_1.map(() => ({
            provider: config.provider,
            hash: config.hash,
            version: originalModuleConfig.version,
            name: originalModuleConfig.name,
            dependencies: originalModuleConfig.dependencies,
            packages: originalModuleConfig.packages
        })), operators_1.tap(() => {
            if (originalModuleConfig.packages.length) {
                this.npmService.installPackages();
            }
        }));
    }
    downloadTypings(moduleLink, folder, fileName, config) {
        if (!moduleLink) {
            return rxjs_1.of(true);
        }
        return this.requestService.get(moduleLink).pipe(operators_1.take(1), operators_1.map(res => {
            this.logger.logFileService(`Done!`);
            return res;
        }), operators_1.switchMap(res => this.fileService.writeFile(folder, fileName, config.typingsFileName, res)));
    }
    importModule(config, token, { folderOverride, waitUntil } = {}) {
        const timer$ = rxjs_1.timer(waitUntil || 20 * 1000);
        this.validateConfig(config);
        if (this.isWeb()) {
            SystemJS.config(Object.assign({
                map: {
                    [token]: config.link
                }
            }, config.SystemJsConfig));
            return SystemJS.import(config.link);
        }
        return new rxjs_1.Observable(observer => {
            const moduleName = config.fileName;
            const moduleNamespace = config.namespace;
            const moduleLink = config.link;
            const moduleExtension = config.extension;
            const moduleSystemJsConfig = config.SystemJsConfig || {};
            const modulesFolder = config.outputFolder || `/${this.defaultOutputFolder}/`;
            const fileFullPath = `${folderOverride ||
                process.cwd()}${modulesFolder}/${moduleNamespace}/${moduleName}.${moduleExtension}`;
            const folder = `${folderOverride ||
                process.cwd()}${modulesFolder}${moduleNamespace}`;
            const fileName = `${moduleName}.${moduleExtension}`;
            Object.assign(moduleSystemJsConfig, {
                paths: Object.assign({ [moduleName]: fileFullPath }, moduleSystemJsConfig.paths)
            });
            SystemJS.config(moduleSystemJsConfig);
            if (this.fileService.isPresent(fileFullPath)) {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): present inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.importExternalModule(moduleName)
                    .pipe(operators_1.take(1))
                    .subscribe(m => {
                    observer.next(m);
                    observer.complete();
                }, err => {
                    observer.error(err);
                    observer.complete();
                });
            }
            else {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): will be downloaded inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): ${moduleLink} downloading...`);
                this.requestService
                    .get(moduleLink)
                    .pipe(operators_1.take(1), operators_1.tap(() => this.logger.logImporter(`Done!`)), operators_1.switchMap(res => this.fileService.writeFile(folder, fileName, config.fileName, res)), operators_1.switchMap(() => this.downloadTypings(config.typings, folder, fileName, config)), operators_1.switchMap(() => this.importExternalModule(moduleName)))
                    .subscribe(m => {
                    observer.next(m);
                    observer.complete();
                }, err => {
                    observer.error(err);
                    observer.complete();
                });
            }
        })
            .pipe(operators_1.takeUntil(timer$))
            .toPromise();
    }
};
__decorate([
    injector_decorator_1.Injector(request_1.RequestService),
    __metadata("design:type", request_1.RequestService)
], ExternalImporter.prototype, "requestService", void 0);
__decorate([
    injector_decorator_1.Injector(file_1.FileService),
    __metadata("design:type", file_1.FileService)
], ExternalImporter.prototype, "fileService", void 0);
__decorate([
    injector_decorator_1.Injector(bootstrap_logger_1.BootstrapLogger),
    __metadata("design:type", bootstrap_logger_1.BootstrapLogger)
], ExternalImporter.prototype, "logger", void 0);
__decorate([
    injector_decorator_1.Injector(compression_service_1.CompressionService),
    __metadata("design:type", compression_service_1.CompressionService)
], ExternalImporter.prototype, "compressionService", void 0);
__decorate([
    injector_decorator_1.Injector(npm_service_1.NpmService),
    __metadata("design:type", npm_service_1.NpmService)
], ExternalImporter.prototype, "npmService", void 0);
ExternalImporter = __decorate([
    container_1.Service()
], ExternalImporter);
exports.ExternalImporter = ExternalImporter;
