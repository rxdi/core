// import { Module } from '../decorators/module/module.decorator';
// import { ConfigModel } from '../services/config/config.model';
// import { BootstrapFramework } from './bootstrap';
// import { ModuleArguments } from '../decorators/module/module.interfaces';
// import { map, switchMap, switchMapTo } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { Container, Injectable } from '../container';

// export const setup = <T, K>(
//     options: ModuleArguments<T, K>,
//     frameworks: any[] = [],
//     bootstrapOptions?: ConfigModel
// ) => {
//     const Module = require('../decorators/module/module.decorator').Module;

//     return BootstrapFramework(Module({
//         imports: options.imports || [],
//         providers: options.providers || [],
//         services: options.services || [],
//         bootstrap: options.bootstrap || [],
//         components: options.components || [],
//         controllers: options.controllers || [],
//         effects: options.effects || [],
//         plugins: options.plugins || [],
//         afterPlugins: options.afterPlugins || [],
//         beforePlugins: options.beforePlugins || [],
//     })(function() {}), frameworks, bootstrapOptions);
// };

// export const createTestBed = setup;

// @Module()
// export class AppModule { }


// @Injectable()
// export class Test {
//     proba() { return 1; }
// }


// @Injectable()
// export class Test2 {
//     proba2() { return 1; }
// }


// setup({
//     imports: [AppModule]
// }).pipe(
//     switchMapTo(setup({ providers: [{ provide: 'value1', lazy: true, useFactory: () => of(1) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value2', lazy: true, useFactory: () => of(2) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value3', lazy: true, useFactory: () => of(3) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value4', lazy: true, useFactory: () => of(4) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(7) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(5) }] })),
//     switchMapTo(setup({ providers: [{ provide: 'value5', lazy: true, useFactory: () => of(0) }] })),

// ).subscribe((a) => {
//     console.log(Container.get('value1'), Container.get('value2'), Container.get('value3'), Container.get('value4'), Container.get('value5'));
// }, console.error.bind(console));
