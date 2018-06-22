import { Service } from '../../container';
import { writeFileSync, existsSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BootstrapLogger } from '../bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';

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
}