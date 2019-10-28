export declare function defineMetadata(metadataKey: any, metadataValue: any, target: any, propertyKey: any): void;
export declare function decorate(decorators: any, target: any, propertyKey: any, attributes: any): any;
export declare function metadata(metadataKey: any, metadataValue: any): (target: any, propertyKey: any) => void;
export declare function getMetadata(metadataKey: any, target: any, propertyKey: any): any;
export declare function getOwnMetadata(metadataKey: any, target: any, propertyKey: any): any;
export declare function hasOwnMetadata(metadataKey: any, target: any, propertyKey: any): boolean;
export declare const Reflection: {
    decorate: typeof decorate;
    defineMetadata: typeof defineMetadata;
    getMetadata: typeof getMetadata;
    getOwnMetadata: typeof getOwnMetadata;
    hasOwnMetadata: typeof hasOwnMetadata;
    metadata: typeof metadata;
};
