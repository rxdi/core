"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../../container/Container");
const metadata_service_1 = require("./metadata.service");
const Service_1 = require("../../decorators/service/Service");
const module_decorator_1 = require("../../decorators/module/module.decorator");
require("jest");
class Pesho {
}
let PeshoService = class PeshoService {
};
PeshoService = __decorate([
    Service_1.Service()
], PeshoService);
let PeshoModule = class PeshoModule {
};
PeshoModule = __decorate([
    module_decorator_1.Module({
        services: [PeshoService]
    })
], PeshoModule);
const metadataService = Container_1.Container.get(metadata_service_1.MetadataService);
describe('Service: Metadata', () => {
    it('Should create appropriate metadata based on imports inside module and hash should equal 32 signs', done => {
        const modules = {
            imports: [PeshoModule],
            services: [PeshoService]
        };
        const generatedHashData = metadataService.generateHashData(modules, Pesho);
        const uniqueModuleTemplate = metadataService.parseModuleTemplate('Pesho', generatedHashData, `${Pesho}`);
        const uniqueHashForClass = metadataService.createUniqueHash(uniqueModuleTemplate);
        expect(generatedHashData[0][0]['hash']).toBe(PeshoService['metadata']['moduleHash']);
        expect(generatedHashData[0][0]['moduleName']).toBe(PeshoService['metadata']['moduleName']);
        expect(generatedHashData[1][0]['hash']).toBe(PeshoModule['metadata']['moduleHash']);
        expect(generatedHashData[1][0]['moduleName']).toBe(PeshoModule['metadata']['moduleName']);
        expect(uniqueHashForClass).toBeTruthy();
        expect(uniqueHashForClass.length).toBe(64);
        done();
    });
});
