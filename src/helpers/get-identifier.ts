import { Token } from '../container/Token';
import { CannotInjectError } from '../container/error/CannotInjectError';
import { TypeOrName } from '../container/types/type-or-name';

export const getIdentifier = (
  typeOrName: TypeOrName,
  target: Object,
  propertyName: string
) => {
  let identifier: any;
  if (typeof typeOrName === 'string') {
    identifier = typeOrName;
  } else if (typeOrName instanceof Token) {
    identifier = typeOrName;
  } else {
    identifier = typeOrName();
  }
  if (identifier === Object) {
    throw new CannotInjectError(target, propertyName);
  }
  return identifier;
};

export const isClient = () => typeof window !== 'undefined' && typeof window.document !== 'undefined';
