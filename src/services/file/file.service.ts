import { Service } from '../../container';
import { writeFileSync, existsSync, readdir, stat } from 'fs';
import * as mkdirp from 'mkdirp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BootstrapLogger } from '../bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { resolve } from 'path';

@Service()
export class FileService {

    @Injector(BootstrapLogger) private logger: BootstrapLogger;

    writeFileSync(folder: string, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(
                map(() => {
                    this.logger.logFileService(`Bootstrap: @Service('${fileName}'): Saved inside ${folder}`);
                    return writeFileSync(`${folder}/${fileName}`, file);
                })
            );
    }

    isPresent(path: string) {
        return existsSync(path);
    }

    mkdirp(folder): Observable<boolean> {
        return Observable.create(observer => {
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



    public fileWalker(dir): Observable<string[]> {
        return Observable.create(observer => {
            this.filewalker(dir, (err, result) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(result);
                }
            });
        });
    }


    private filewalker(dir, done) {
        let results = [];
        const fileWalker = this.filewalker.bind(this);
        readdir(dir, function (err, list) {
            if (err) {
                return done(err);
            }
            let pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach(function (file) {
                file = resolve(dir, file);
                stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        results.push(file);
                        fileWalker(file, function (err, res) {
                            results = results.concat(res);
                            if (!--pending) {
                                done(null, results);
                            }
                        });
                    } else {
                        results.push(file);
                        if (!--pending) {
                            done(null, results);
                        }
                    }
                });
            });
        });
    }
}