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
const container_1 = require("../../container");
const config_1 = require("../config");
const injector_decorator_1 = require("../../decorators/injector/injector.decorator");
let BootstrapLogger = class BootstrapLogger {
    log(message) {
        if (this.configService.config.logger.logging) {
            const m = [this.logDate(), message];
            console.log(...m);
            return m;
        }
    }
    error(message) {
        console.error(message);
    }
    logImporter(message) {
        if (this.configService.config.logger.logging) {
            return this.log(message);
        }
    }
    logDate() {
        if (this.configService.config.logger.date) {
            return `${Date.now().toPrecision()}`;
        }
        else {
            return '';
        }
    }
    logFileService(message) {
        if (this.configService.config.logger.fileService) {
            this.log(message);
            return '``';
        }
    }
    logHashes(message) {
        if (this.configService.config.logger.hashes) {
            return message;
        }
        else {
            return '';
        }
    }
    logExitHandler(message) {
        if (this.configService.config.logger.exitHandler) {
            this.log(message);
        }
        else {
            return '';
        }
    }
};
__decorate([
    injector_decorator_1.Injector(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], BootstrapLogger.prototype, "configService", void 0);
BootstrapLogger = __decorate([
    container_1.Service()
], BootstrapLogger);
exports.BootstrapLogger = BootstrapLogger;
