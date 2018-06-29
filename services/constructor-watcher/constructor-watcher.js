"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConstructorWatcherService {
    constructor() {
        this._constructors = new Map();
    }
    getConstructor(name) {
        return this._constructors.get(name);
    }
    getByClass(currentClass) {
        return this._constructors.get(currentClass.name)['value'];
    }
    createConstructor(name, value) {
        if (this._constructors.has(name)) {
            return this.getConstructor(name);
        }
        this._constructors.set(name, value);
        return this.getConstructor(name);
    }
}
exports.ConstructorWatcherService = ConstructorWatcherService;
exports.constructorWatcherService = new ConstructorWatcherService();
