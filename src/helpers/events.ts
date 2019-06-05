function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}
export const InternalEvents = strEnum(['load', 'config']);
export type InternalEvents = keyof typeof InternalEvents;

export const InternalLayers = strEnum(['globalConfig', 'modules']);
export type InternalLayers = keyof typeof InternalLayers;
