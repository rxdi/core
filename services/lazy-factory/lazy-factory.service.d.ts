import { Observable } from 'rxjs';
export declare class LazyFactory {
    lazyFactories: Map<any, any>;
    setLazyFactory(provide: string, factory: Observable<Function> | Promise<Function>): any;
    getLazyFactory(provide: string): any;
}
