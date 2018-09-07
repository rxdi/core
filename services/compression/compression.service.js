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
// import { createReadStream, createWriteStream } from 'fs';
// import { createGzip, createGunzip } from 'zlib';
// import { Observable } from 'rxjs';
const container_1 = require("../../container");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
const index_1 = require("../config/index");
let CompressionService = class CompressionService {
    // public gZipFile(input: string, output: string, options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }) {
    //     const config = this.config.config.experimental.crypto || options;
    //     return Observable.create(observer => {
    //         createReadStream(input)
    //             .pipe(createGzip())
    //             // .pipe(createCipheriv(config.algorithm, config.cyperKey, config.cyperIv))
    //             .pipe(createWriteStream(output))
    //             .on('finish', () => observer.next(true))
    //             .on('error', (err) => observer.error(err));
    //     });
    // }
    // public readGzipFile(input: string, output: string, options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }) {
    //     const config = this.config.config.experimental.crypto || options;
    //     return Observable.create(observer => {
    //         createReadStream(input)
    //             // .pipe(createDecipheriv(config.algorithm, config.cyperKey, config.cyperIv))
    //             .pipe(createGunzip())
    //             .pipe(createWriteStream(output))
    //             .on('finish', () => observer.next(true))
    //             .on('error', (err) => observer.error(err));
    //     });
    // }
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
    injector_decorator_1.Injector(index_1.ConfigService),
    __metadata("design:type", index_1.ConfigService)
], CompressionService.prototype, "config", void 0);
CompressionService = __decorate([
    container_1.Service()
], CompressionService);
exports.CompressionService = CompressionService;
