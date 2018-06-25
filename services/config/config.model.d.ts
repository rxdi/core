export declare class LoggerConfig {
    logging?: boolean;
    hashes?: boolean;
    date?: boolean;
    exitHandler?: boolean;
    fileService?: boolean;
}
export declare class PrivateCryptoModel {
    algorithm?: string;
    cyperIv?: string;
    cyperKey?: string;
}
export declare class ExperimentalFeatures {
    crypto?: PrivateCryptoModel;
}
export declare class ConfigModel {
    init?: boolean;
    experimental?: ExperimentalFeatures;
    logger?: LoggerConfig;
}
