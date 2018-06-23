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
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Inject_1 = require("../../../../../container/decorators/Inject");
const Service_1 = require("../../../../../container/decorators/Service");
let UserService = class UserService {
    constructor(ipfsDownloadedFactory, testFactoryAsync, chainableFactory) {
        this.ipfsDownloadedFactory = ipfsDownloadedFactory;
        this.testFactoryAsync = testFactoryAsync;
        this.chainableFactory = chainableFactory;
        console.log('UserService', this.ipfsDownloadedFactory.testKey(), this.testFactoryAsync);
        this.chainableFactory
            .pipe(operators_1.map((res) => res))
            .subscribe(value => console.log('Value chaining factory ', value));
    }
    testService(key) {
        console.log(key);
        return key;
    }
};
UserService = __decorate([
    Service_1.Service(),
    __param(0, Inject_1.Inject('createUniqueHash')),
    __param(1, Inject_1.Inject('testFactoryAsync')),
    __param(2, Inject_1.Inject('testChainableFactoryFunction')),
    __metadata("design:paramtypes", [Object, Object, rxjs_1.Observable])
], UserService);
exports.UserService = UserService;
