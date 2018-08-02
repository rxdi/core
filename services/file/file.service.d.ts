import { Observable } from 'rxjs';
export declare class FileService {
    private logger;
    writeFile(folder: string, fileName: any, moduleName: any, file: any): Observable<{}>;
    writeFileAsync(folder: string, fileName: any, moduleName: any, file: any): Observable<string>;
    isPresent(path: string): boolean;
    private writeFileAsyncP;
    mkdirp(folder: any): Observable<boolean>;
    fileWalker(dir: any): Observable<string[]>;
    private filewalker;
}
