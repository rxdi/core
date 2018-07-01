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
class PrivateCryptoModel {
}
exports.PrivateCryptoModel = PrivateCryptoModel;
class ExperimentalFeatures {
}
exports.ExperimentalFeatures = ExperimentalFeatures;
class InitOptionsConfig {
}
exports.InitOptionsConfig = InitOptionsConfig;
class ConfigModel {
    constructor() {
        this.init = true;
        this.initOptions = new InitOptionsConfig();
        this.experimental = new ExperimentalFeatures();
        this.logger = new LoggerConfig();
    }
}
exports.ConfigModel = ConfigModel;
