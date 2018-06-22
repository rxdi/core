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
const fs_1 = require("fs");
const mkdirp = require("mkdirp");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const bootstrap_logger_1 = require("../bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
let FileService = class FileService {
    writeFileSync(folder, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(operators_1.map(() => {
            this.logger.logFileService(`Bootstrap: @Service('${fileName}'): Saved inside ${folder}`);
            return fs_1.writeFileSync(`${folder}/${fileName}`, file);
        }));
    }
    isPresent(path) {
        return fs_1.existsSync(path);
    }
    mkdirp(folder) {
        return rxjs_1.Observable.create(observer => {
            mkdirp(folder, (err) => {
                if (err) {
                    console.error(err);
                    observer.error(false);
                }
                else {
                    observer.next(true);
                }
            });
        });
    }
};
__decorate([
    injector_decorator_1.Injector(bootstrap_logger_1.BootstrapLogger),
    __metadata("design:type", bootstrap_logger_1.BootstrapLogger)
], FileService.prototype, "logger", void 0);
FileService = __decorate([
    container_1.Service()
], FileService);
exports.FileService = FileService;
