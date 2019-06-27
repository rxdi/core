import { Metadata } from '../decorators';
import { createUniqueHash } from './create-unique-hash';
import { Container } from '../container/Container';
import { ServiceMetadata } from '../container/types/ServiceMetadata';
import { ServiceOptions } from '../container/types/ServiceOptions';
import { Token } from '../container/Token';

export function ReflectDecorator<T, K extends keyof T>(
  options: any,
  metaOptions: Metadata
) {
  return (target: Function) => {
    const uniqueHashForClass = createUniqueHash(
      `${target}${JSON.stringify(options, null, 4)}`
    );
    Object.defineProperty(target, 'originalName', {
      value: target.name || target.constructor.name,
      writable: false
    });
    Object.defineProperty(target, 'name', {
      value: uniqueHashForClass,
      writable: true
    });
    const nameCapitalized = (name: string) =>
      name.charAt(0).toUpperCase() + name.slice(1);

    target['metadata'] = {
      moduleName: target['originalName'],
      moduleHash: uniqueHashForClass,
      options: options || null,
      type: metaOptions.type,
      raw: `
        ---- @${nameCapitalized(metaOptions.type)} '${target.name}' metadata----
        @${nameCapitalized(metaOptions.type)}(${JSON.stringify(
        options,
        null,
        4
      )})
        ${target['originalName']}
        `
    };
    const service: ServiceMetadata<T, K> = {
      type: target
    };

    if (typeof options === 'string' || options instanceof Token) {
        service.id = options;
        service.multiple = (options as ServiceOptions<T, K>).multiple;
        service.global = (options as ServiceOptions<T, K>).global || false;
        service.transient = (options as ServiceOptions<T, K>).transient;

    } else if (options) { // ServiceOptions
        service.id = (options as ServiceOptions<T, K>).id;
        service.factory = (options as ServiceOptions<T, K>).factory;
        service.multiple = (options as ServiceOptions<T, K>).multiple;
        service.global = (options as ServiceOptions<T, K>).global || false;
        service.transient = (options as ServiceOptions<T, K>).transient;
    }


    Container.set(service);
  };
}
