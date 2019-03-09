export class ConstructorWatcherService {
    _constructors: Map<string, Function> = new Map();

    getConstructor(name: string) {
        return this._constructors.get(name);
    }

    getByClass<T>(currentClass: Function): T {
        return this._constructors.get(currentClass.name)['value'];
    }

    createConstructor(name: string, value) {
        if (this._constructors.has(name)) {
            return this.getConstructor(name);
        }

        this._constructors.set(name, value);
        return this.getConstructor(name);

    }

    triggerOnInit(currentClass: Function) {
        const currentConstructor = this._constructors.get(currentClass.name);
        if (currentConstructor['value'] && currentConstructor['value'].OnInit) {
            currentConstructor['value'].OnInit.bind(currentConstructor['value'])();
        }
    }


}

export const constructorWatcherService = new ConstructorWatcherService();