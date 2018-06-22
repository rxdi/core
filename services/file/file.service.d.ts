import { Observable } from 'rxjs';
export declare class FileService {
    private logger;
    writeFileSync(folder: string, fileName: any, moduleName: any, file: any): Observable<void>;
    isPresent(path: string): boolean;
    mkdirp(folder: any): Observable<boolean>;
}
