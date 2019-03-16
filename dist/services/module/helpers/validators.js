"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = require("../../../container");
let ModuleValidators = class ModuleValidators {
    validateEmpty(m, original, type) {
        if (!m) {
            const requiredType = type.charAt(0).toUpperCase() + type.slice(1);
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: ${original.metadata.moduleName}
            -> @Module hash: ${original.metadata.moduleHash}
                --> Maybe you forgot to import some ${requiredType} inside ${original.metadata.moduleName} ?

                Hint: run ts-lint again, looks like imported ${requiredType} is undefined or null inside ${original.metadata.moduleName}
            `);
        }
    }
    genericWrongPluggableError(m, original, type) {
        if (m.metadata.type !== type) {
            const moduleType = m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1);
            const requiredType = type.charAt(0).toUpperCase() + type.slice(1);
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${moduleType} '${m.metadata.moduleName}' provided, where expected class decorated with '@${requiredType}' instead,
            -> @Hint: please provide class with @Service decorator or remove ${m.metadata.moduleName} class
            `);
        }
    }
    validateImports(m, original) {
        if (m.metadata.type !== 'module') {
            throw new Error(`
            ${original.metadata.raw}
            -> @Module: '${original.metadata.moduleName}'
            -> @Module hash: '${original.metadata.moduleHash}'
                --> @${m.metadata.type.charAt(0).toUpperCase() + m.metadata.type.slice(1)} '${m.originalName}' provided, where expected class decorated with '@Module' instead,
            -> @Hint: please provide class with @Module decorator or remove ${m.originalName} from imports
            `);
        }
    }
    validateServices(m, original) {
        this.validateEmpty(m, original, 'service');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'service');
    }
    validatePlugin(m, original) {
        this.validateEmpty(m, original, 'plugin');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'plugin');
    }
    validateController(m, original) {
        this.validateEmpty(m, original, 'controller');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'controller');
    }
    validateEffect(m, original) {
        this.validateEmpty(m, original, 'effect');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'effect');
    }
    validateComponent(m, original) {
        this.validateEmpty(m, original, 'component');
        if (m.provide) {
            return;
        }
        this.genericWrongPluggableError(m, original, 'component');
    }
};
ModuleValidators = __decorate([
    container_1.Service()
], ModuleValidators);
exports.ModuleValidators = ModuleValidators;
