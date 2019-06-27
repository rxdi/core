"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("../../decorators/service/Service");
const config_model_1 = require("./config.model");
let ConfigService = class ConfigService {
    constructor() {
        this.config = new config_model_1.ConfigModel();
    }
    setConfig(config) {
        Object.assign(this.config, config);
    }
};
ConfigService = __decorate([
    Service_1.Service()
], ConfigService);
exports.ConfigService = ConfigService;
