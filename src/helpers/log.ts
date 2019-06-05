import { Container } from '../container/Container';

export const logExtendedInjectables = (
  name: { name: string },
  logExtendedInjectables: boolean
) => {
  if (Container.has(name) && logExtendedInjectables) {
    console.log(
      `Warn: Injection Token '${name.name ||
        name}' is extended after it has being declared! ${JSON.stringify(
        Container.get(name)
      )}`
    );
  }
};
