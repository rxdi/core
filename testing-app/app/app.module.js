"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { UserModule } from './user/user.module';
// import { CoreModule } from './core/core.module';
const module_decorator_1 = require("../../decorators/module/module.decorator");
const index_1 = require("../../container/index");
// Container.get(ExternalImporter)
//     .downloadIpfsModule({
//         ipfsLink: 'http://127.0.0.1:8080/ipfs/',
//         ipfsModule: 'QmU68GpadeYHcB4Vn9EGETn4XWXjCxM5ogdTfpidW2SDMU'
//     })
//     .subscribe(res => {
//     }, er => console.error(er));
let Proba = class Proba {
    constructor(test) {
        this.test = test;
        console.log(this.test);
    }
};
Proba = __decorate([
    index_1.Service(),
    __param(0, index_1.Inject('pesho')),
    __metadata("design:paramtypes", [Object])
], Proba);
exports.Proba = Proba;
let AppModule = class AppModule {
};
AppModule = __decorate([
    module_decorator_1.Module({
        imports: [],
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
], AppModule);
exports.AppModule = AppModule;
