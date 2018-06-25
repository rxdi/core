import { Service } from '../../container/decorators/Service';

export class ConstructorWatcherService {
    _constructors: Map<string, Function> = new Map();

    getConstructor(name: string) {
        return this._constructors.get(name);
    }

    createConstructor(name: string, value){
        if (this._constructors.has(name)) {
            return this.getConstructor(name);
        }

        this._constructors.set(name, value);
        return this.getConstructor(name);

    }

    
}

export const constructorWatcherService = new ConstructorWatcherService();