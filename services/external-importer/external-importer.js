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
const SystemJS = require("systemjs");
const request_1 = require("../request");
const file_1 = require("../file");
const operators_1 = require("rxjs/operators");
const bootstrap_logger_1 = require("../bootstrap-logger/bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
let ExternalImporter = class ExternalImporter {
    importExternalModule(module) {
        return rxjs_1.from(SystemJS.import(module));
    }
    validateConfig(config) {
        if (!config) {
            throw new Error('Bootstrap: missing config');
        }
        if (!config.fileName) {
            throw new Error('Bootstrap: missing fileName ');
        }
    }
    importModule(config) {
        this.validateConfig(config);
        return new rxjs_1.Observable(o => {
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
                    .subscribe(m => o.next(m), err => o.error(err));
            }
            else {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): will be downloaded inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): ${moduleLink} downloading...`);
                this.requestService.get(moduleLink)
                    .pipe(operators_1.take(1), operators_1.map((res) => {
                    this.logger.logImporter(`Done!`);
                    return res;
                }), operators_1.switchMap((res) => this.fileService.writeFileSync(folder, fileName, moduleNamespace, res)), operators_1.switchMap(() => this.importExternalModule(moduleName)))
                    .subscribe((m) => o.next(m), err => o.error(err));
            }
        });
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
ExternalImporter = __decorate([
    container_1.Service()
], ExternalImporter);
exports.ExternalImporter = ExternalImporter;
