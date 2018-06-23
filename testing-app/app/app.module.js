"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_module_1 = require("./user/user.module");
const core_module_1 = require("./core/core.module");
const module_decorator_1 = require("../../decorators/module/module.decorator");
let AppModule = class AppModule {
};
AppModule = __decorate([
    module_decorator_1.Module({
        imports: [
            core_module_1.CoreModule,
            user_module_1.UserModule
        ]
    })
], AppModule);
exports.AppModule = AppModule;
