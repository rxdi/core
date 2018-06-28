import { createUniqueHash } from "../../helpers/create-unique-hash";
import { ServiceMetadata } from "../../container/types/ServiceMetadata";
import { Container } from "../../container/Container";

export function Component<T, K extends keyof T>(): Function {
    return function (target: Function) {

        const uniqueHashForClass = createUniqueHash(`${target}`);
        Object.defineProperty(target, 'originalName', { value: target.name || target.constructor.name, writable: false });
        Object.defineProperty(target, 'name', { value: uniqueHashForClass, writable: true });

        target['metadata'] = {
            moduleName: target['originalName'],
            moduleHash: uniqueHashForClass,
            type: 'component',
            raw: `
            ---- @Component '${target.name}' metadata----
            @Component()
            ${target['originalName']}
            `
        };

        const service: ServiceMetadata<T, K> = {
            type: target
        };

        Container.set(service);
    };
}