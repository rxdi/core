import { Service } from '../../container';
import { writeFileSync, existsSync, readdir, stat, writeFile } from 'fs';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BootstrapLogger } from '../bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { resolve } from 'path';
import { mkdirp } from './dist';

@Service()
export class FileService {

    @Injector(BootstrapLogger) private logger: BootstrapLogger;

    writeFileSync(folder: string, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(
                map(() => {
                    this.logger.logFileService(`Bootstrap: @Service('${moduleName}'): Saved inside ${folder}`);
                    writeFileSync(`${folder}/${fileName}`, file);
                    return `${folder}/${fileName}`;
                })
            );
    }

    writeFileAsync(folder: string, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(
                switchMap(() => this.writeFileAsyncP(folder, fileName, file)),
                map(() => {
                    this.logger.logFileService(`Bootstrap: external @Module('${moduleName}') namespace: Saved inside ${folder}`);
                    return `${folder}/${fileName}`;
                })
            );
    }

    isPresent(path: string) {
        return existsSync(path);
    }

    private writeFileAsyncP(folder, fileName, content) {
        return Observable.create(o => writeFile(`${folder}/${fileName}`, content, () => o.next(true)));
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
        readdir(dir, (err, list) => {
            if (err) {
                return done(err);
            }
            let pending = list.length;
            if (!pending) {
                return done(null, results);
            }
            list.forEach( (file) => {
                file = resolve(dir, file);
                stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        results.push(file);
                        fileWalker(file, (err, res) => {
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