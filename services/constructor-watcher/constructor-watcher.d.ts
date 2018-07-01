export declare class ConstructorWatcherService {
    _constructors: Map<string, Function>;
    getConstructor(name: string): Function;
    getByClass<T>(currentClass: Function): T;
    createConstructor(name: string, value: any): Function;
    triggerOnInit(currentClass: Function): void;
}
export declare const constructorWatcherService: ConstructorWatcherService;
