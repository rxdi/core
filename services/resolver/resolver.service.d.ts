import { Observable } from 'rxjs';
export declare class ResolverService {
    private bootstrapLogger;
    private cacheService;
    resolveDependencies(hash: any, target: any, moduleName: any): Observable<any[]>;
    private resolveContainerDependencies(target, moduleName);
}
