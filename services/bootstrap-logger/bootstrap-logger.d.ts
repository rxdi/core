import { ConfigService } from '../config/index';
export declare class BootstrapLogger {
    configService: ConfigService;
    log(message: string): string[];
    error(message: string): void;
    logImporter(message: string): string[];
    logDate(): string;
    logFileService(message: string): string;
    logHashes(message: string): string;
    logExitHandler(message: string): string;
}
