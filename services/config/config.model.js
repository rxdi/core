"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoggerConfig {
    constructor() {
        this.logging = true;
        this.hashes = true;
        this.date = true;
        this.exitHandler = true;
        this.fileService = true;
    }
}
exports.LoggerConfig = LoggerConfig;
class ConfigModel {
    constructor() {
        this.init = true;
        this.logger = new LoggerConfig();
    }
}
exports.ConfigModel = ConfigModel;
