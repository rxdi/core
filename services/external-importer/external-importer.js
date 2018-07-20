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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../container");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const request_1 = require("../request");
const file_1 = require("../file");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const SystemJS = require("systemjs");
const compression_service_1 = require("../compression/compression.service");
const config_1 = require("../config");
const fs_1 = require("fs");
let ExternalImporter = class ExternalImporter {
    importExternalModule(module) {
        return rxjs_1.from(SystemJS.import(module));
    }
    validateConfig(config) {
        if (!config) {
            throw new Error('Bootstrap: missing config');
        }
    }
    encryptFile(fileFullPath) {
        if (this.configService.config.experimental.crypto) {
            return this.compressionService.readGzipFile(fileFullPath, 'dada');
        }
        else {
            return rxjs_1.of(null);
        }
    }
    decryptFile(fileFullPath) {
        if (this.configService.config.experimental.crypto) {
            return this.compressionService.gZipFile(fileFullPath, 'dada');
        }
        else {
            return rxjs_1.of(null);
        }
    }
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
    loadPackageJson() {
        return JSON.parse(fs_1.readFileSync(`${process.cwd()}/package.json`, { encoding: 'utf-8' }));
    }
    findCurrentModule() {
    }
    isModulePresent(hash) {
        const file = this.loadPackageJson();
        const ipfsConfig = file.ipfs;
        const found = [];
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
        const ipfsConfig = file.ipfs;
        let dups = [];
        ipfsConfig.forEach(c => {
            const uniq = c.dependencies
                .map((name) => {
                return { count: 1, name: name };
            })
                .reduce((a, b) => {
                a[b.name] = (a[b.name] || 0) + b.count;
                return a;
            }, {});
            const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
            dups = [...dups, ...duplicates];
        });
        if (dups.length) {
            throw new Error(`There are packages which are with the same hash ${JSON.stringify(dups)}`);
        }
        return dups.length;
    }
    addPackageToJson(hash) {
        const file = this.loadPackageJson();
        const ipfsConfig = file.ipfs;
        if (this.isModulePresent(hash)) {
            this.logger.log(`Package with hash: ${hash} present and will not be downloaded!`);
        }
        else {
            ipfsConfig[0].dependencies.push(hash);
            file.ipfs = ipfsConfig;
        }
        fs_1.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf-8' });
    }
    downloadIpfsModules(modules) {
        const latest = modules.map(m => this.downloadIpfsModule(m));
        return rxjs_1.combineLatest(latest.length ? latest : rxjs_1.of());
    }
    downloadIpfsModuleConfig(config) {
        return this.requestService.get(config.provider + config.hash, config.hash)
            .pipe(operators_1.map((r) => {
            if (!r) {
                throw new Error('Recieved undefined from provided address' + config.provider + config.hash);
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
        }), operators_1.map((r) => {
            let res = r;
            try {
                res = JSON.parse(r);
            }
            catch (e) { }
            return res;
        }));
    }
    combineDependencies(dependencies, config) {
        return rxjs_1.combineLatest(dependencies.length ? dependencies.map(d => this.downloadIpfsModule({ provider: config.provider, hash: d })) : rxjs_1.of(''));
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
        let originalModuleConfig;
        return this.downloadIpfsModuleConfig(config)
            .pipe(operators_1.tap(res => {
            if (!res['module']) {
                console.log('Todo: create logic to load module which is not from rxdi infrastructure for now can be used useDynamic which will do the same job!');
            }
        }), operators_1.filter((res) => !!res.module), operators_1.map((m) => {
            moduleName = m.name;
            originalModuleConfig = m;
            folder = `${process.cwd()}/node_modules/`;
            moduleLink = `${config.provider}${m.module}`;
            moduleTypings = `${config.provider}${m.typings}`;
            m.dependencies = m.dependencies || [];
            this.logger.logFileService(`Package config for module ${moduleName} downloaded! ${JSON.stringify(m)}`);
            return m;
        }), operators_1.switchMap((m) => this.combineDependencies(m.dependencies, config)), operators_1.switchMap((res) => {
            this.logger.logFileService(`--------------------${moduleName}--------------------`);
            this.logger.logFileService(`\nDownloading... ${configLink} `);
            this.logger.logFileService(`Config: ${JSON.stringify(originalModuleConfig, null, 2)} \n`);
            return this.requestService.get(moduleLink, config.hash);
        }), operators_1.switchMap((file) => this.fileService.writeFileSync(folder + moduleName, 'index.js', moduleName, file)), operators_1.switchMap(() => this.requestService.get(moduleTypings, config.hash)), operators_1.switchMap((file) => this.fileService.writeFileSync(folder + `@types/${moduleName}`, 'index.d.ts', moduleName, file)), operators_1.map(() => {
            return {
                provider: config.provider,
                name: originalModuleConfig.name,
                dependencies: originalModuleConfig.dependencies
            };
        }));
    }
    downloadTypings(config) {
        if (!config.typings) {
            return rxjs_1.of(null);
        }
        const moduleName = config.fileName;
        const moduleNamespace = config.namespace;
        const moduleLink = config.typings;
        const modulesFolder = config.outputFolder || `/external_modules/`;
        const folder = `${process.cwd()}${modulesFolder}@types/${moduleNamespace}`;
        const fileName = `${moduleName}.d.ts`;
        return this.requestService.get(moduleLink)
            .pipe(operators_1.take(1), operators_1.map((res) => {
            this.logger.logFileService(`Done!`);
            return res;
        }), operators_1.switchMap((res) => this.fileService.writeFileSync(folder, fileName, config.fileName, res)));
    }
    importModule(config, token) {
        this.validateConfig(config);
        if (this.isWeb()) {
            SystemJS.config(Object.assign({
                map: {
                    [token]: config.link
                }
            }, config.SystemJsConfig));
            return SystemJS.import(config.link);
        }
        return rxjs_1.Observable.create((observer) => __awaiter(this, void 0, void 0, function* () {
            const moduleName = config.fileName;
            const moduleNamespace = config.namespace;
            const moduleLink = config.link;
            const moduleExtension = config.extension;
            const moduleSystemJsConfig = config.SystemJsConfig || {};
            const modulesFolder = config.outputFolder || `/external_modules/`;
            const fileFullPath = `${process.cwd()}${modulesFolder}/${moduleNamespace}/${moduleName}.${moduleExtension}`;
            const folder = `${process.cwd()}${modulesFolder}${moduleNamespace}`;
            const fileName = `${moduleName}.${moduleExtension}`;
            Object.assign(moduleSystemJsConfig, { paths: Object.assign({ [moduleName]: fileFullPath }, moduleSystemJsConfig.paths) });
            SystemJS.config(moduleSystemJsConfig);
            if (this.fileService.isPresent(fileFullPath)) {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): present inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.importExternalModule(moduleName)
                    .pipe(operators_1.take(1))
                    .subscribe(m => observer.next(m), err => observer.error(err));
            }
            else {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): will be downloaded inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): ${moduleLink} downloading...`);
                this.requestService.get(moduleLink)
                    .pipe(operators_1.take(1), operators_1.map((res) => {
                    this.logger.logImporter(`Done!`);
                    return res;
                }), operators_1.switchMap((res) => this.fileService.writeFileSync(folder, fileName, config.fileName, res)), operators_1.switchMap(() => this.importExternalModule(moduleName)), operators_1.switchMap(() => this.downloadTypings(config)))
                    .subscribe((m) => observer.next(m), err => observer.error(err));
            }
        }));
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
    injector_decorator_1.Injector(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], ExternalImporter.prototype, "configService", void 0);
ExternalImporter = __decorate([
    container_1.Service()
], ExternalImporter);
exports.ExternalImporter = ExternalImporter;
