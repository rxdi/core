import { Observable } from "rxjs";
import { CompressionService } from "../../../../../services";
import { FileService } from "../../../../../services/file";
export declare class UserService {
    private ipfsDownloadedFactory;
    private testFactoryAsync;
    private chainableFactory;
    private compression;
    private fileService;
    constructor(ipfsDownloadedFactory: {
        testKey: () => string;
    }, testFactoryAsync: {
        testKey: () => string;
    }, chainableFactory: Observable<number>, compression: CompressionService, fileService: FileService);
    testService(key: any): any;
}
