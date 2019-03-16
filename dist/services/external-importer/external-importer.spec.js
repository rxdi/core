"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../../container/Container");
const external_importer_1 = require("./external-importer");
const operators_1 = require("rxjs/operators");
require("jest");
const externalImporterService = Container_1.Container.get(external_importer_1.ExternalImporter);
describe('Service: ExternalImporter', () => {
    it('Should import external IPFS module and add it to node_modules folder from where should be depend', (done) => {
        const module = externalImporterService.importModule({
            fileName: 'createUniqueHash',
            namespace: '@helpers',
            extension: 'js',
            typings: '',
            outputFolder: '/node_modules/',
            link: 'https://ipfs.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
        }, 'createUniqueHash');
        module.pipe(operators_1.tap((res) => {
            expect(res.testKey.constructor).toBe(Function);
            expect(res.testKey()).toBe('TestKey');
        }), operators_1.tap(() => done())).subscribe();
    });
    // it('Should import external IPFS module and load it from browser cache', (done) => {
    //     spyOn(externalImporterService, 'isWeb').and.returnValue(true);
    //     const module: Observable<any> = <any>from(externalImporterService.importModule({
    //         link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
    //     }, 'createUniqueHash'));
    //     module.pipe(
    //         tap((res: { testKey: () => string; }) => {
    //             expect(res.testKey.constructor).toBe(Function);
    //             expect(res.testKey()).toBe('TestKey');
    //         }),
    //         tap(() => done())
    //     ).subscribe();
    // });
});
