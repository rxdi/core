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
Object.defineProperty(exports, "__esModule", { value: true });
const constructor_watcher_1 = require("./constructor-watcher");
const Container_1 = require("../../container/Container");
const controller_decorator_1 = require("../../decorators/controller/controller.decorator");
const Service_1 = require("../../decorators/service/Service");
require("jest");
let TestService = class TestService {
    constructor() {
        this.id = 2;
    }
};
TestService = __decorate([
    Service_1.Service()
], TestService);
exports.TestService = TestService;
let TestConstructor = class TestConstructor {
    constructor(testService) {
        this.testService = testService;
        this.id = 1;
    }
    OnInit() {
        this.test();
    }
    test() {
        return 1;
    }
};
TestConstructor = __decorate([
    controller_decorator_1.Controller(),
    __metadata("design:paramtypes", [TestService])
], TestConstructor);
describe('Service: ConstructorWatcher', () => {
    it('Should create appropriate class with this applied to constructor', done => {
        Container_1.Container.get(TestConstructor);
        Container_1.Container.get(TestService);
        const testConstructorThis = constructor_watcher_1.constructorWatcherService.getByClass(TestConstructor);
        const testServiceThis = constructor_watcher_1.constructorWatcherService.getByClass(TestService);
        expect(testConstructorThis.id).toBe(1);
        expect(testServiceThis.id).toBe(2);
        done();
    });
    it('Should trigger OnInit on current test Class ', done => {
        const testConstructor = Container_1.Container.get(TestConstructor);
        const testSpy = spyOn(testConstructor, 'OnInit');
        Container_1.Container.get(TestService);
        constructor_watcher_1.constructorWatcherService.triggerOnInit(TestConstructor);
        expect(testSpy).toHaveBeenCalled();
        done();
    });
});
