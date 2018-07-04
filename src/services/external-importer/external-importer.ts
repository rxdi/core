import { Service } from '../../container';
import { ExternalImporterConfig } from './external-importer-config';
import { from, Observable, of } from 'rxjs';
import { RequestService } from '../request';
import { FileService } from '../file';
import { map, switchMap, take } from 'rxjs/operators';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import SystemJS = require('systemjs');
import { CompressionService } from '../compression/compression.service';
import { ConfigService } from '../config';

@Service()
export class ExternalImporter {

    @Injector(RequestService) requestService: RequestService;
    @Injector(FileService) fileService: FileService;
    @Injector(BootstrapLogger) logger: BootstrapLogger;
    @Injector(CompressionService) compressionService: CompressionService;
    @Injector(ConfigService) private configService: ConfigService;

    importExternalModule(module: string) {
        return from(SystemJS.import(module));
    }

    validateConfig(config: ExternalImporterConfig) {
        if (!config) {
            throw new Error('Bootstrap: missing config');
        }
    }

    encryptFile(fileFullPath: string) {
        if (this.configService.config.experimental.crypto) {
            return this.compressionService.readGzipFile(fileFullPath, 'dada');
        } else {
            return of(null);
        }
    }

    decryptFile(fileFullPath: string) {
        if (this.configService.config.experimental.crypto) {
            return this.compressionService.gZipFile(fileFullPath, 'dada');
        } else {
            return of(null);
        }
    }

    isWeb() {
        let value = false;
        try {
            if (window) {
                value = true;
            }
        } catch (e) { }
        return value;
    }

    importModule(config: ExternalImporterConfig, token: string): Promise<any> {
        this.validateConfig(config);
        if (this.isWeb()) {
            SystemJS.config(Object.assign({
                map: {
                    [token]: config.link
                }
            }, config.SystemJsConfig));
            return SystemJS.import(config.link);
        }
        return Observable.create(async observer => {

            const moduleName = config.fileName;
            const moduleNamespace = config.namespace;
            const moduleLink = config.link;
            const moduleExtension = config.extension;
            const moduleSystemJsConfig = config.SystemJsConfig || {};
            const modulesFolder = config.outputFolder || `/external_modules/`;
            const fileFullPath = `${process.cwd()}${modulesFolder}/${moduleNamespace}/${moduleName}.${moduleExtension}`;
            const folder = `${process.cwd()}${modulesFolder}${moduleNamespace}`;
            const fileName = `${moduleName}.${moduleExtension}`;

            Object.assign(moduleSystemJsConfig, { paths: { [moduleName]: fileFullPath, ...moduleSystemJsConfig.paths } });

            SystemJS.config(moduleSystemJsConfig);

            if (this.fileService.isPresent(fileFullPath)) {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): present inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.importExternalModule(moduleName)
                    .pipe(take(1))
                    .subscribe(
                        m => observer.next(m),
                        err => observer.error(err)
                    );
            } else {
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): will be downloaded inside .${modulesFolder}${moduleNamespace}/${moduleName}.${moduleExtension} folder and loaded from there`);
                this.logger.logImporter(`Bootstrap -> @Service('${moduleName}'): ${moduleLink} downloading...`);

                this.requestService.get(moduleLink)
                    .pipe(
                        take(1),
                        map((res) => {
                            this.logger.logImporter(`Done!`);
                            return res;
                        }),
                        switchMap((res) => this.fileService.writeFileSync(folder, fileName, moduleNamespace, res)),
                        switchMap(() => this.importExternalModule(moduleName))
                    )
                    .subscribe(
                        (m) => observer.next(m),
                        err => observer.error(err)
                    );
            }
        });
    }
}