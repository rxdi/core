// import { UserModule } from './user/user.module';
// import { CoreModule } from './core/core.module';
import { Module } from '../../decorators/module/module.decorator';
import { ExternalImporter } from '../../services/external-importer/external-importer';
import { Container, Service, Inject } from '../../container/index';
// Container.get(ExternalImporter)
//     .downloadIpfsModule({
//         ipfsLink: 'http://127.0.0.1:8080/ipfs/',
//         ipfsModule: 'QmU68GpadeYHcB4Vn9EGETn4XWXjCxM5ogdTfpidW2SDMU'
//     })
//     .subscribe(res => {
//     }, er => console.error(er));

@Service()
export class Proba {
    constructor(
        @Inject('pesho') private test: any
    ) {
        console.log(this.test);
    }
}

@Module({
    imports: [
        // CoreModule,
        // UserModule
    ],
    services: [
        Proba,
        {
            provide: 'pesho',
            useDynamic: {
                fileName: 'createUniqueHash',
                namespace: '@helpers',
                extension: 'js',
                typings: '',
                outputFolder: '/node_modules/',
                link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
            }
        }
    ]
})
export class AppModule { }
