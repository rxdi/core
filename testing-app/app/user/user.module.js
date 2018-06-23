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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const rxjs_1 = require("rxjs");
const module_decorator_1 = require("../../../decorators/module/module.decorator");
const Plugin_1 = require("../../../container/decorators/Plugin");
let TestHapiPlugin = class TestHapiPlugin {
    constructor() {
        console.log("PLUGIN");
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            // this.server.route({
            //     method: 'GET',
            //     path: '/test',
            //     handler: this.handler.bind(this)
            // });
        });
    }
    handler(request, h) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'dada1';
        });
    }
};
TestHapiPlugin = __decorate([
    Plugin_1.Plugin(),
    __metadata("design:paramtypes", [])
], TestHapiPlugin);
exports.TestHapiPlugin = TestHapiPlugin;
let UserModule = class UserModule {
};
UserModule = __decorate([
    module_decorator_1.Module({
        plugins: [TestHapiPlugin],
        services: [
            services_1.UserService,
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
                useFactory: () => __awaiter(this, void 0, void 0, function* () {
                    return new Promise((resolve) => {
                        setTimeout(() => resolve('dad2a'), 0);
                    });
                })
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
                useFactory: () => new rxjs_1.Observable(o => o.next(15))
            },
        ]
    })
], UserModule);
exports.UserModule = UserModule;
