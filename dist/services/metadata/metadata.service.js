"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../decorators/service/Service");
const helpers_1 = require("../../helpers");
let MetadataService = class MetadataService {
    generateHashData(module, original) {
        const services = module.services || [];
        const imports = module.imports || [];
        const fillMetadata = injectable => {
            if (injectable && injectable['provide']) {
                return injectable['provide'];
            }
            else if (injectable) {
                this.validateCustomInjectable(injectable, module, original);
                return {
                    moduleName: injectable['metadata']['moduleName'],
                    hash: injectable['metadata']['moduleHash']
                };
            }
        };
        return [
            [...services.map(i => fillMetadata(i))],
            [...imports.map(i => fillMetadata(i))]
        ];
    }
    validateCustomInjectableKeys(keys) {
        // keys.forEach(key => {
        //     console.log('TOVA NE E SHEGA', key);
        // });
    }
    validateCustomInjectable(injectable, module, original) {
        if (!injectable['metadata'] && !injectable['provide']) {
            throw new Error(`
                ---- Wrong service ${JSON.stringify(injectable)} provided inside '${original.name}' ----
                @Module({
                    services: ${JSON.stringify([
                ...module.services.filter(i => !i['metadata']),
                ...module.services
                    .filter(i => i && i['metadata'] && i['metadata']['moduleName'])
                    .map(i => i['metadata']['moduleName'])
            ])}
                })
                ${JSON.stringify(`${original}`, null, 2)}

                Hint: System recieved Object but it is not with appropriate format you must provide object with following parameters:

                YourObject: ${JSON.stringify(injectable)}

                Option 1. [YourClass]

                Option 2. [{provide: 'your-value', useClass: YourClass}]

                Option 3. [{provide: 'your-value', deps: [YourClass], useFactory: (test: YourClass) => {}}]

                Option 4. [{provide: 'your-value', useDynamic: {}}]

                Option 5. [{provide: 'your-value', useValue: 'your-value'}]
            `);
        }
    }
    parseModuleTemplate(moduleName, generatedHashData, targetCurrentSymbol) {
        return `
            ---- @gapi module '${moduleName}' metadata----
            @Module({
                imports: ${JSON.stringify(generatedHashData[1], null, '\t')},
                services: ${JSON.stringify(generatedHashData[0], null, '\t')}
            })
            ${JSON.stringify(targetCurrentSymbol, null, 2)}
        `;
    }
    createUniqueHash(string) {
        return helpers_1.createUniqueHash(string);
    }
};
MetadataService = __decorate([
    Service_1.Service()
], MetadataService);
exports.MetadataService = MetadataService;
