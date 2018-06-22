import { Service, Container, Inject } from '../../container';
import { CacheService } from '../cache/cache-layer.service';
import { InternalLayers, InternalEvents } from '../../helpers/events';
import { switchMap, filter } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';

@Service()
export class ResolverService {

    @Injector(BootstrapLogger) private bootstrapLogger: BootstrapLogger;
    @Injector(CacheService) private cacheService: CacheService;

    resolveDependencies(hash, target, moduleName): Observable<any[]> {
        this.cacheService.getLayer(InternalLayers.modules).putItem({ key: hash, data: target });
        const currentModule = this.cacheService.getLayer(hash);
        currentModule.putItem({ key: InternalEvents.config, data: { moduleName, moduleHash: hash } });
        return currentModule.getItemObservable(InternalEvents.load)
            .pipe(
                switchMap((config) => {
                    if (!config.data) {
                        return of(null);
                    }
                    return currentModule.items.asObservable();
                }),
                filter((res) => this.resolveContainerDependencies(res, target, moduleName))
            );
    }

    private resolveContainerDependencies(res, target, moduleName: string) {
        if (!res || !res.length) {
            return false;
        } else {
            res.forEach((i) => {
                if (i.key === InternalEvents.load || i.key === InternalEvents.config) {
                    return;
                }
                const found = this.cacheService.searchForItem(i.data);
                if (found) {
                    this.bootstrapLogger.log(`Start -> @Module('${moduleName}')${this.bootstrapLogger.logHashes(`(${target.name})`)}: @Service('${found.originalName}')${this.bootstrapLogger.logHashes(`(${found.name})`)}` + ' initialized!');
                    return Container.get(found);
                } else {
                    throw new Error('not found');
                }
            });
            return res;
        }
    }
}