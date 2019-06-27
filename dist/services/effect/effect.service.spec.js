"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const effect_service_1 = require("./effect.service");
const Container_1 = require("../../container/Container");
const effect_decorator_1 = require("../../decorators/effect/effect.decorator");
require("jest");
const effectService = Container_1.Container.get(effect_service_1.EffectsService);
let TestEffect = class TestEffect {
};
TestEffect = __decorate([
    effect_decorator_1.Effect()
], TestEffect);
describe('Service: EffectsService', () => {
    it('Should register appropriate effect inside effects observable', done => {
        effectService.register(TestEffect);
        expect(effectService.getEffects().length).toBe(1);
        done();
    });
});
