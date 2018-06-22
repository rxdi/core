export class LoggerConfig {
    logging?: boolean = true;
    hashes?: boolean = true;
    date?: boolean = true;
    exitHandler?: boolean = true;
    fileService?: boolean = true;
}


export class ConfigModel {
    init?: boolean = true;
    logger?: LoggerConfig = new LoggerConfig();
}