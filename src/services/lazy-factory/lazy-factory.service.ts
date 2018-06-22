import { Service } from '../../container';
import { Observable } from 'rxjs';

@Service()
export class LazyFactory {
    lazyFactories: Map<any, any> = new Map();
    setLazyFactory(provide: string, factory: Observable<Function> | Promise<Function>) {
        this.lazyFactories.set(provide, factory);
        return this.getLazyFactory(provide);
    }
    getLazyFactory(provide: string) {
        return this.lazyFactories.get(provide);
    }
}
