import { Service } from '../../container';
import { writeFileSync, existsSync, readdir, stat, writeFile, readFileSync, readFile } from 'fs';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BootstrapLogger } from '../bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { resolve } from 'path';
import { mkdirp } from './dist';
import { forEach } from '../../services/module/helpers/forEach';

@Service()
export class FileService {

    @Injector(BootstrapLogger) private logger: BootstrapLogger;

    writeFile(folder: string, fileName, moduleName, file) {
        return this.mkdirp(folder)
            .pipe(
                tap(() => {
                    this.logger.logFileService(`Bootstrap: @Service('${moduleName}'): Saved inside ${folder}`);
                }),
                switchMap(() => this.writeFileAsyncP(folder, fileName, file))
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

    writeFileSync(folder, file) {
        return writeFileSync.bind(null)(folder, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf-8' });
    }

    readFile(file: string) {
        return JSON.parse(readFileSync.bind(null)(file, { encoding: 'utf-8' }));
    }

    isPresent(path: string) {
        return existsSync(path);
    }

    writeFileAsyncP(folder, fileName, content) {
        return new Observable(o => writeFile(`${folder}/${fileName}`, content, () => o.next(true)));
    }

    mkdirp(folder): Observable<boolean> {
        return new Observable(observer => {
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
            forEach(list, (file) => {
                file = resolve(dir, file);
                stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        results.push(file);
                        if (!file.includes('node_modules')) {
                            fileWalker(file, (err, res) => {
                                results = results.concat(res);
                                if (!--pending) {
                                    done(null, results);
                                }
                            });
                        } else if (!--pending) {
                            done(null, results);
                        }
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