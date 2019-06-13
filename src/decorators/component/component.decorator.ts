import { createUniqueHash } from '../../helpers/create-unique-hash';
import { ServiceMetadata } from '../../container/types/ServiceMetadata';
import { Container } from '../../container/Container';

export function Component<T, K extends keyof T>(options?: {init?: boolean}): Function {
    return function (target: Function) {

        const uniqueHashForClass = createUniqueHash(`${target}${JSON.stringify(options, null, 4)}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });

        target['metadata'] = {
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            options: options || null,
            type: 'component',
            raw: `
            ---- @Component '${target.name}' metadata----
            @Component(${JSON.stringify(options, null, 4)})
            ${target['originalName']}
            `
        };

        const service: ServiceMetadata<T, K> = {
            type: target
        };

        Container.set(service);
    };
}