import { createReadStream, createWriteStream, stat, readdir } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { resolve } from 'path';
import { createDecipheriv, createCipheriv } from 'crypto';
import { Observable } from 'rxjs';
import { Service } from '../../container';
import { Injector } from '../../decorators/injector/injector.decorator';
import { ConfigService, PrivateCryptoModel } from '../config/index';

@Service()
export class CompressionService {

    @Injector(ConfigService) private config: ConfigService;

    public gZipFile(input: string, output: string, options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }) {
        const config = this.config.config.experimental.crypto || options;
        return Observable.create(observer => {
            createReadStream(input)
                .pipe(createGzip())
                // .pipe(createCipheriv(config.algorithm, config.cyperKey, config.cyperIv))
                .pipe(createWriteStream(output))
                .on('finish', () => observer.next(true))
                .on('error', (err) => observer.error(err));
        });
    }

    public readGzipFile(input: string, output: string, options: PrivateCryptoModel = { cyperIv: '', algorithm: '', cyperKey: '' }) {
        const config = this.config.config.experimental.crypto || options;
        return Observable.create(observer => {
            createReadStream(input)
                // .pipe(createDecipheriv(config.algorithm, config.cyperKey, config.cyperIv))
                .pipe(createGunzip())
                .pipe(createWriteStream(output))
                .on('finish', () => observer.next(true))
                .on('error', (err) => observer.error(err));
        });
    }


    public gZipAll() {
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

}