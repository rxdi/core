"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_service_1 = require("./controllers.service");
const Container_1 = require("../../container/Container");
const controller_decorator_1 = require("../../decorators/controller/controller.decorator");
require("jest");
const controllersService = Container_1.Container.get(controllers_service_1.ControllersService);
let TestEffect = class TestEffect {
};
TestEffect = __decorate([
    controller_decorator_1.Controller()
], TestEffect);
describe('Service: ControllersService', () => {
    it('Should register appropriate controller', done => {
        controllersService.register(TestEffect);
        expect(controllersService.getControllers().length).toBe(1);
        done();
    });
});
