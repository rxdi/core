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
const injector_decorator_1 = require("./injector.decorator");
const container_1 = require("../../container");
require("jest");
describe('Decorators: @Injector', () => {
    it('Should inject value to property "valueExecutor" inside target ClassTestExecutor', (done) => {
        class ClassTestProvider {
            constructor() {
                this.valueProvider = 1;
            }
        }
        class ClassTestExecutor {
        }
        __decorate([
            injector_decorator_1.Injector(ClassTestProvider),
            __metadata("design:type", ClassTestProvider)
        ], ClassTestExecutor.prototype, "valueExecutor", void 0);
        expect(container_1.Container.get(ClassTestExecutor).valueExecutor.valueProvider).toBe(1);
        done();
    });
});
