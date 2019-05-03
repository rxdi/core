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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const bootstrap_logger_1 = require("../bootstrap-logger");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const path_1 = require("path");
const dist_1 = require("./dist");
let FileService = class FileService {
    writeFile(folder, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(operators_1.tap(() => {
            this.logger.logFileService(`Bootstrap: @Service('${moduleName}'): Saved inside ${folder}`);
        }), operators_1.switchMap(() => this.writeFileAsyncP(folder, fileName, file)));
    }
    writeFileAsync(folder, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(operators_1.switchMap(() => this.writeFileAsyncP(folder, fileName, file)), operators_1.map(() => {
            this.logger.logFileService(`Bootstrap: external @Module('${moduleName}') namespace: Saved inside ${folder}`);
            return `${folder}/${fileName}`;
        }));
    }
    writeFileSync(folder, file) {
        return fs_1.writeFileSync.bind(null)(folder, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf-8' });
    }
    readFile(file) {
        return JSON.parse(fs_1.readFileSync.bind(null)(file, { encoding: 'utf-8' }));
    }
    isPresent(path) {
        return fs_1.existsSync(path);
    }
    writeFileAsyncP(folder, fileName, content) {
        return new rxjs_1.Observable(o => fs_1.writeFile(`${folder}/${fileName}`, content, () => o.next(true)));
    }
    mkdirp(folder) {
        return new rxjs_1.Observable(observer => {
            dist_1.mkdirp(folder, (err) => {
                if (err) {
                    console.error(err);
                    observer.error(false);
                }
                else {
                    observer.next(true);
                }
                observer.complete();
            });
        });
    }
    fileWalker(dir) {
        return rxjs_1.Observable.create(observer => {
            this.filewalker(dir, (err, result) => {
                if (err) {
                    observer.error(err);
                }
                else {
                    observer.next(result);
                }
            });
        });
    }
    filewalker(dir, done) {
        let results = [];
        const fileWalker = this.filewalker.bind(this);
        fs_1.readdir(dir, (err, list) => {
            if (err) {
                return done(err);
            }
            let pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach((file) => {
                file = path_1.resolve(dir, file);
                fs_1.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        results.push(file);
                        if (!file.includes('node_modules')) {
                            fileWalker(file, (err, res) => {
                                results = results.concat(res);
                                if (!--pending) {
                                    done(null, results);
                                }
                            });
                        }
                        else if (!--pending) {
                            done(null, results);
                        }
                    }
                    else {
                        results.push(file);
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
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
