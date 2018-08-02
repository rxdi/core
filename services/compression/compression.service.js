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
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const rxjs_1 = require("rxjs");
const container_1 = require("../../container");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const config_1 = require("../config");
let CompressionService = class CompressionService {
    gZipFile(input, output, options = { cyperIv: '', algorithm: '', cyperKey: '' }) {
        const config = this.config.config.experimental.crypto || options;
        return rxjs_1.Observable.create(observer => {
            fs_1.createReadStream(input)
                .pipe(zlib_1.createGzip())
                // .pipe(createCipheriv(config.algorithm, config.cyperKey, config.cyperIv))
                .pipe(fs_1.createWriteStream(output))
                .on('finish', () => observer.next(true))
                .on('error', (err) => observer.error(err));
        });
    }
    readGzipFile(input, output, options = { cyperIv: '', algorithm: '', cyperKey: '' }) {
        const config = this.config.config.experimental.crypto || options;
        return rxjs_1.Observable.create(observer => {
            fs_1.createReadStream(input)
                // .pipe(createDecipheriv(config.algorithm, config.cyperKey, config.cyperIv))
                .pipe(zlib_1.createGunzip())
                .pipe(fs_1.createWriteStream(output))
                .on('finish', () => observer.next(true))
                .on('error', (err) => observer.error(err));
        });
    }
    gZipAll() {
        // var archiver = require('archiver');
        // var output = createWriteStream('./example.tar.gz');
        // var archive = archiver('tar', {
        //     gzip: true,
        //     zlib: { level: 9 } // Sets the compression level.
        // });
        // archive.on('error', function (err) {
        //     throw err;
        // });
        // // pipe archive data to the output file
        // archive.pipe(output);
        // // append files
        // archive.file('/path/to/file0.txt', { name: 'file0-or-change-this-whatever.txt' });
        // archive.file('/path/to/README.md', { name: 'foobar.md' });
        // // Wait for streams to complete
        // archive.finalize();
    }
};
__decorate([
    injector_decorator_1.Injector(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], CompressionService.prototype, "config", void 0);
CompressionService = __decorate([
    container_1.Service()
], CompressionService);
exports.CompressionService = CompressionService;
