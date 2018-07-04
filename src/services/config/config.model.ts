export class LoggerConfig {
    logging?: boolean = process.env.LOGGING === 'true' ? true : false;
    hashes?: boolean = true;
    date?: boolean = true;
    exitHandler?: boolean = true;
    fileService?: boolean = true;
}

export class PrivateCryptoModel {
    algorithm?: string;
    cyperIv?: string;
    cyperKey?: string;
}

export class ExperimentalFeatures {
    crypto?: PrivateCryptoModel;
}

export class InitOptionsConfig {
    services?: boolean;
    controllers?: boolean;
    effects?: boolean;
    pluginsBefore?: boolean;
    plugins?: boolean;
    components?: boolean;
    pluginsAfter?;
}

export class ConfigModel {
    init?: boolean = true;
    initOptions?: InitOptionsConfig = new InitOptionsConfig();
    experimental?: ExperimentalFeatures = new ExperimentalFeatures();
    logger?: LoggerConfig = new LoggerConfig();
}