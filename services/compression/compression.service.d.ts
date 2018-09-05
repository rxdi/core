import { PrivateCryptoModel } from '../config/index';
export declare class CompressionService {
    private config;
    gZipFile(input: string, output: string, options?: PrivateCryptoModel): any;
    readGzipFile(input: string, output: string, options?: PrivateCryptoModel): any;
    gZipAll(): void;
}
