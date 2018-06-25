

import { UserService } from './services';
import { Observable } from 'rxjs';
import { Module } from '../../../decorators/module/module.decorator';
import { PluginInterface, Plugin } from '../../../container/decorators/Plugin';
import { Service } from '../../../container';
import { CREATE_UNIQUE_HASH } from './user.tokens';

@Plugin()
export class TestHapiPlugin implements PluginInterface {

    constructor(
        // @Inject(HAPI_SERVER) private server: Server
    ) {
        console.log("PLUGIN");
    }

    async register() {
        // this.server.route({
        //     method: 'GET',
        //     path: '/test',
        //     handler: this.handler.bind(this)
        // });
    }

    async handler(request, h) {
        return 'dada1';
    }

}

@Module({
    services: [
        UserService,
        {
            provide: CREATE_UNIQUE_HASH,
            useDynamic: {
                fileName: 'createUniqueHash',
                namespace: '@helpers',
                extension: 'js',
                typings: '',
                outputFolder: '/node_modules/',
                link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
            }
        },
        {
            provide: 'testFactoryAsync',
            lazy: true,
            useFactory: async () => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve('dad2a'), 0);
                })
            }
        },
        {
            provide: 'testFactorySync',
            useFactory: () => {
                return 'dada';
            }
        },
        {
            provide: 'testValue2',
            useValue: 'dadada'
        },
        {
            provide: 'testChainableFactoryFunction',
            // lazy: true, if you don't provide lazy parameter your factory will remain Observable so you can chain it inside constructor
            useFactory: () => new Observable(o => o.next(15))
        },
    ]
})
export class UserModule {}