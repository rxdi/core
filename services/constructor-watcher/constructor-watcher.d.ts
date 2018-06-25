export declare class ConstructorWatcherService {
    _constructors: Map<string, Function>;
    getConstructor(name: string): Function;
    createConstructor(name: string, value: any): Function;
}
export declare const constructorWatcherService: ConstructorWatcherService;
