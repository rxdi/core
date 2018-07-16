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
const request_1 = require("../request");
const file_1 = require("../file");
const operators_1 = require("rxjs/operators");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const SystemJS = require("systemjs");
const compression_service_1 = require("../compression/compression.service");
const config_1 = require("../config");
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
    downloadIpfsModules(modules) {
        return rxjs_1.from(modules)
            .pipe(operators_1.switchMap((m) => this.downloadIpfsModule(m)));
    }
    downloadIpfsModule(config) {
        if (!config.ipfsProvider) {
            throw new Error(`Missing configuration inside ${config.hash}`);
        }
        if (!config.hash) {
            throw new Error(`Missing configuration inside ${config.ipfsProvider}`);
        }
        let folder;
        let moduleLink;
        let moduleTypings;
        let moduleName;
        return this.requestService.get(config.ipfsProvider + config.hash)
            .pipe(operators_1.take(1), operators_1.map((r) => JSON.parse(r)), operators_1.map((m) => {
            moduleName = m.name;
            folder = `${process.cwd()}/node_modules/`;
            moduleLink = `${config.ipfsProvider}${m.module}`;
            moduleTypings = `${config.ipfsProvider}${m.typings}`;
            this.logger.logFileService(`Package config for module ${moduleName} downloaded! ${JSON.stringify(m)}`);
            return m;
        }), operators_1.switchMap(() => this.requestService.get(moduleLink)), operators_1.switchMap((file) => this.fileService.writeFileSync(folder + moduleName, 'index.js', moduleName, file)), operators_1.switchMap(() => this.requestService.get(moduleTypings)), operators_1.switchMap((file) => this.fileService.writeFileSync(folder + `@types/${moduleName}`, 'index.d.ts', moduleName, file)));
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
