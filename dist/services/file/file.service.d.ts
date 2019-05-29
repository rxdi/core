import { Observable } from 'rxjs';
export declare class FileService {
    private logger;
    writeFile(folder: string, fileName: any, moduleName: any, file: any): Observable<unknown>;
    writeFileAsync(folder: string, fileName: any, moduleName: any, file: any): Observable<string>;
    writeFileSync(folder: any, file: any): any;
    readFile(file: string): any;
    isPresent(path: string): boolean;
    writeFileAsyncP(folder: any, fileName: any, content: any): Observable<unknown>;
    mkdirp(folder: any): Observable<boolean>;
    fileWalker(dir: string, exclude?: string): Observable<string[]>;
    private filewalker;
}
