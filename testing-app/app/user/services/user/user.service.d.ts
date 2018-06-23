import { Observable } from "rxjs";
export declare class UserService {
    private ipfsDownloadedFactory;
    private testFactoryAsync;
    private chainableFactory;
    constructor(ipfsDownloadedFactory: {
        testKey: () => string;
    }, testFactoryAsync: {
        testKey: () => string;
    }, chainableFactory: Observable<number>);
    testService(key: any): any;
}
