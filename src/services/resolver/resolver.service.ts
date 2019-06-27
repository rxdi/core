import { Container } from '../../container';
import { CacheService } from '../cache/cache-layer.service';
import { InternalLayers, InternalEvents } from '../../helpers/events';
import { switchMap, filter, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { Service } from '../../decorators/service/Service';

@Service()
export class ResolverService {
  @Injector(BootstrapLogger) private bootstrapLogger: BootstrapLogger;
  @Injector(CacheService) private cacheService: CacheService;

  resolveDependencies(hash, target, moduleName): Observable<any[]> {
    this.cacheService
      .getLayer(InternalLayers.modules)
      .putItem({ key: hash, data: target });
    const currentModule = this.cacheService.getLayer(hash);
    currentModule.putItem({
      key: InternalEvents.config,
      data: { moduleName, moduleHash: hash }
    });
    return currentModule.getItemObservable(InternalEvents.load).pipe(
      switchMap(config => {
        if (!config.data) {
          return of(null);
        }
        return currentModule.items.asObservable();
      }),
      filter(res => res && res.length),
      map(this.resolveContainerDependencies(target, moduleName))
    );
  }

  private resolveContainerDependencies(target, moduleName: string) {
    return res => {
      res.forEach(i => {
        if (i.key === InternalEvents.load || i.key === InternalEvents.config) {
          return;
        }
        const found = this.cacheService.searchForItem(i.data);
        if (found) {
          if (found.provide) {
            return found;
          }
          const moduleType =
            found.metadata.type.charAt(0).toUpperCase() +
            found.metadata.type.slice(1);
          this.bootstrapLogger.log(
            `Start -> @Module('${moduleName}')${this.bootstrapLogger.logHashes(
              `(${target.name})`
            )}: @${moduleType}('${
              found.originalName
            }')${this.bootstrapLogger.logHashes(`(${found.name})`)}` +
              ' initialized!'
          );
          return Container.get(found);
        } else {
          throw new Error('not found');
        }
      });
      return res;
    };
  }
}
