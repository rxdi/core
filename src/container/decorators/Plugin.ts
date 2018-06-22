import { ServiceMetadata } from '../types/ServiceMetadata';
import { ServiceOptions } from '../types/ServiceOptions';
// import { ControllerContainerService } from '../../services/controller-service/controller.service';
import { Token } from '../Token';
import { Container } from '../Container';
import { createUniqueHash } from '../../helpers/create-unique-hash';
export interface PluginInterface {
    name?: string;
    version?: string;
    register(server?, options?): void;
    handler?(request, h);
}
export function Plugin<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string): Function {
    return function (target) {
        const original = target;
        original.prototype._plugin = true;

        const uniqueHashForClass = createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });

        target['metadata'] = {
            useFactory: optionsOrServiceName && optionsOrServiceName['useFactory'] || null,
            provideIn: optionsOrServiceName && optionsOrServiceName['provideIn'] || 'root',
            moduleName: target['originalName'],
            hash: uniqueHashForClass
        };

        const service: ServiceMetadata<T, K> = {
            type: original
        };

        if (typeof optionsOrServiceName === 'string' || optionsOrServiceName instanceof Token) {
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;

        } else if (optionsOrServiceName) { // ServiceOptions
            service.id = (optionsOrServiceName as ServiceOptions<T, K>).id;
            service.factory = (optionsOrServiceName as ServiceOptions<T, K>).factory;
            service.multiple = (optionsOrServiceName as ServiceOptions<T, K>).multiple;
            service.global = (optionsOrServiceName as ServiceOptions<T, K>).global || false;
            service.transient = (optionsOrServiceName as ServiceOptions<T, K>).transient;
        }
        Container.set(service);
    };
}