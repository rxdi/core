// import { UserModule } from './user/user.module';
// import { CoreModule } from './core/core.module';
import { Module } from '../../decorators/module/module.decorator';
import { ExternalImporter } from '../../services/external-importer/external-importer';
import { Container } from '../../container/index';
// Container.get(ExternalImporter)
//     .downloadIpfsModule({
//         ipfsLink: 'http://127.0.0.1:8080/ipfs/',
//         ipfsModule: 'QmU68GpadeYHcB4Vn9EGETn4XWXjCxM5ogdTfpidW2SDMU'
//     })
//     .subscribe(res => {
//     }, er => console.error(er));



@Module({
    imports: [
        // CoreModule,
        // UserModule
    ]
})
export class AppModule { }
