## Powerful Dependency Injection inside Browser and Node using Typescript and RXJS 6
***
> The idea behind [@rxdi](https://github.com/rxdi) is to create independent, dependency injection that can be used everywhere,
> Node and Browser with purpose also to share the same code without chainging nothing!
> First steps where with platform called [@gapi](https://github.com/Stradivario/gapi) you can check repository [@gapi/core](https://github.com/Stradivario/gapi-core).
> Then because of the needs of the platform i decided to develop this Reactive Dependency Injection container helping me build progressive applications.
> Hope you like my journey!
> Any help and suggestions are appreciated!
Main repository [@rxdi/core](https://github.com/rxdi/core) 
***

#### Example starter projects:
[Client Side](https://github.com/rxdi/starter-client-side)

[Client Side Advanced](https://github.com/rxdi/starter-client-side-advanced)

[Server Side](https://github.com/rxdi/starter-server-side)

More examples for [@rxdi](https://www.npmjs.com/~rxdi) infrastructure you can check inside [@gapi](https://www.npmjs.com/~gapi) namespace.

##### @Beta Decentralized node_modules using ipfs network with rxdi infrastructure

> Install `@rxdi/core` global so we will have `rxdi` command available `npm i -g @rxdi/core`

> Install single decentralized ipfs module `rxdi install QmWtJLqyokMZE37DgncpY5HhFvtFQieBzMPDQ318aJeTw6`

> More details you can find [here](https://github.com/rxdi/ipfs-package-example) `ipfs-package-example`

> Example module `https://ipfs.io/ipfs/QmWtJLqyokMZE37DgncpY5HhFvtFQieBzMPDQ318aJeTw6`

> `@rxdi/core` can be found also inside decentralized space [here](https://ipfs.io/ipfs/QmP9n7m1UWkFn2hqt7mnfQYnBtxmFyyvKZHN7hgngQb1gM)

> `@rxdi/core` can be installed with '@rxdi/core' total inception :D `rxdi i QmP9n7m1UWkFn2hqt7mnfQYnBtxmFyyvKZHN7hgngQb1gM`

> No more package downtime!

## Installation and basic examples:
##### To install this library, run:

```bash
npm install @rxdi/core
```

## Simplest app

main.ts
```typescript
import { Bootstrap } from '@rxdi/core';
import { AppModule } from './app/app.module';

Bootstrap(AppModule, {
    init: false, // if init is false you can set specifically which parts of the system should initialize their constructors
    initOptions: {
        services: true,
        components: true,
        effects: true,
        controllers: true,
        plugins: true,
        pluginsAfter: true,
        pluginsBefore: true
    },
    logger: {
        logging: true,
        date: true,
        hashes: true,
        exitHandler: true,
        fileService: true
    }
})
.subscribe(
    () => console.log('App Started!'),
    (err) => console.error(err)
);
```

app.module.ts
```typescript
import { Module } from "@rxdi/core";
import { UserModule } from './user/user.module';

@Module({
    imports: [UserModule]
})
export class AppModule {}
```



user.module.ts
```typescript


import { Module } from '@rxdi/core';
import { UserService } from './services';
import { Observable } from 'rxjs';

@Module({
    services: [
        UserService,
        {
            provide: 'createUniqueHash',
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
```

user.service.ts
```typescript
import { Service, Inject } from "@rxdi/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Service()
export class UserService {
    constructor(
        @Inject('createUniqueHash') private ipfsDownloadedFactory: { testKey: () => string },
        @Inject('testFactoryAsync') private testFactoryAsync: { testKey: () => string },
        @Inject('testChainableFactoryFunction') private chainableFactory: Observable<number>

    ) {
        console.log('UserService', this.ipfsDownloadedFactory.testKey(), this.testFactoryAsync);
        this.chainableFactory
            .pipe(
                map((res) => res)
            )
            .subscribe(value => console.log('Value chaining factory ', value));

    }
}
```


Result
```typescript
1529604446114 Bootstrap -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): loading...
1529604446116 Bootstrap -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): loading...
1529604446118 Bootstrap -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): finished!
1529604446118 Bootstrap -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): finished!
1529604446119 Bootstrap -> @Service('createUniqueHash'): loading...
1529604446121 Bootstrap -> @Service('createUniqueHash'): will be downloaded inside ./node_modules/@helpers/createUniqueHash.js folder and loaded from there
1529604446121 Bootstrap -> @Service('createUniqueHash'): https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug downloading...
1529604446137 Bootstrap -> @Service('testFactoryAsync'): loading...
1529604446146 Bootstrap -> @Service('testFactoryAsync'): loading finished! 21:07:26
1529604446795 Done!
1529604446797 Bootstrap: @Service('createUniqueHash.js'): Saved inside /home/rampage/Desktop/concept-starter/node_modules/@helpers
1529604446808 Bootstrap -> @Service('createUniqueHash'): loading finished! 21:07:26
1529604446810 Done!
1529604446811 Bootstrap: @Service('createUniqueHash.js'): Saved inside /home/rampage/Desktop/concept-starter/node_modules/@helpers
1529604446812 Bootstrap -> press start!
1529604446813 Start -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): @Service('UserService')(ea785b316b77dbfe5cb361a7cdcbcb31) initialized!
UserService TestKey dad2a
Value chaining factory  15
1529604446813 Start -> @Module('UserModule')(9ed4f039657f52019d2d9adb0f9df09f): loaded!
1529604446813 Start -> @Module('AppModule')(adb785e839fa19736cea0920cd39b783): loaded!
Started!
AppStopped
```



### ForRoot configuration for modules

```typescript
import { Module, ModuleWithServices, InjectionToken } from '@rxdi/core';

@Service()
export class MODULE_DI_CONFIG {
    text: string = 'Hello world';
}


export const MY_MODULE_CONFIG = new InjectionToken<MODULE_DI_CONFIG>('my-module-config');


@Module({
  imports: []
})
export class YourModule {
  public static forRoot(config?: any): ModuleWithServices {
    return {
      module: YourModule,
      services: [
          { provide: MY_MODULE_CONFIG, useValue: { text: 'Hello world' } },
          { provide: MY_MODULE_CONFIG, useClass: MODULE_DI_CONFIG },
          { 
            provide: MY_MODULE_CONFIG,
            useFactory: () => {
                return {text: 'Hello world'};
            }
          },
          {
            provide: 'ipfsDownloadableFactory',
            useDynamic: {
                fileName: 'createUniqueHash',
                namespace: '@helpers',
                extension: 'js',
                typings: '',
                outputFolder: '/node_modules/',
                link: 'https://ipfs.infura.io/ipfs/QmdQtC3drfQ6M6GFpDdrhYRKoky8BycKzWbTkc4NEzGLug'
            }
          }
      ],
      components: [],
      frameworkImports: []
    }
  }
}
```

[Parcel](https://parceljs.org/getting_started.html)

Inside `@gapi/cli` package there is a command called `gapi start --local --parcel`
this command will run @gapi or @rxdi application with parcel there is a also command called `gapi build` which will take `src/main.ts` and will bundle it the same way like `parcel build src/main.ts --target node`

To install `@gapi/cli` type:

```bash
npm i -g @gapi/cli
```

Start with `@gapi/cli`
```bash
gapi start --local --parcel
```

Build with `@gapi/cli`
```bash
gapi build
```

Or you can install Parcel globally and use instead of `@gapi/cli`

Install Parcel:
```bash
npm install -g parcel-bundler
```

Build single bundle from first bootstrapped file in this case `main.ts`

```bash
parcel build src/main.ts --target node
```

This command will generate single file from this application inside `dist/main.js` with mappings `dist/main.map`

Starting bundled application
```bash
node ./dist/main.js
```

Important!

This will not bundle your node modules only rxdi application.


If you want to start app with `ts-node` for example you need to set inside `tsconfig.json` -> compilerOptions: {}

```json
{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true
    }
}

```