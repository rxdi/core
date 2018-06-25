export class LoggerConfig {
    logging?: boolean = true;
    hashes?: boolean = true;
    date?: boolean = true;
    exitHandler?: boolean = true;
    fileService?: boolean = true;
}

export class PrivateCryptoModel {
    algorithm?: string;
    cyperIv?: string;
    cyperKey?: string
}

export class ExperimentalFeatures {
    crypto?: PrivateCryptoModel;
}

export class ConfigModel {
    init?: boolean = true;
    experimental?: ExperimentalFeatures = new ExperimentalFeatures();
    logger?: LoggerConfig = new LoggerConfig();
}