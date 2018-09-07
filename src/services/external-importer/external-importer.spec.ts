import { Container } from '../../container/Container';
import { ExternalImporter } from './external-importer';
import { tap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

const externalImporterService = Container.get(ExternalImporter);
describe('Service: ExternalImporter', () => {
    it('Should import external IPFS module and add it to node_modules folder from where should be depend', (done) => {
        const module: Observable<any> = <any>externalImporterService.importModule({
            fileName: 'createUniqueHash',
            namespace: '@helpers',
            extension: 'js',
            typings: '',
            outputFolder: '/node_modules/',
            link: 'https://ipfs.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
        }, 'createUniqueHash');
        module.pipe(
            tap((res: { testKey: () => string; }) => {
                expect(res.testKey.constructor).toBe(Function);
                expect(res.testKey()).toBe('TestKey');
            }),
            tap(() => done())
        ).subscribe();
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
