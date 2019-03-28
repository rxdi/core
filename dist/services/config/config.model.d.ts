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
    logExtendedInjectables?: boolean;
    showModuleWithDependencies?: boolean;
}
export declare class InitOptionsConfig {
    services?: boolean;
    controllers?: boolean;
    effects?: boolean;
    pluginsBefore?: boolean;
    plugins?: boolean;
    components?: boolean;
    pluginsAfter?: any;
}
export declare class ConfigModel {
    init?: boolean;
    initOptions?: InitOptionsConfig;
    experimental?: ExperimentalFeatures;
    logger?: LoggerConfig;
}
