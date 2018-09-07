export declare class MetadataService {
    generateHashData(module: any, original: Function): any[][];
    validateCustomInjectableKeys(keys: Array<'useFactory' | 'provide' | 'useValue' | 'useClass' | 'useDynamic' | string>): void;
    validateCustomInjectable(injectable: any, module: any, original: any): void;
    parseModuleTemplate(moduleName: any, generatedHashData: any, targetCurrentSymbol: any): string;
    createUniqueHash(string: string): any;
}
