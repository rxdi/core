import { Observable } from 'rxjs';
export declare class RequestService {
    private cache;
    private logger;
    get(link: string, cacheHash?: any): Observable<any>;
}
