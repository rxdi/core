import { Service } from '../../container';
import { ExternalImporterConfig, ExternalImporterIpfsConfig } from './external-importer-config';
import { from, Observable, of } from 'rxjs';
import { RequestService } from '../request';
import { FileService } from '../file';
import { map, switchMap, take, combineAll, switchMapTo } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import SystemJS = require('systemjs');
import { CompressionService } from '../compression/compression.service';
import { ConfigService } from '../config';

@Service()
export class ExternalImporter {

    @Injector(RequestService) private requestService: RequestService;
    @Injector(FileService) private fileService: FileService;
    @Injector(BootstrapLogger) private logger: BootstrapLogger;
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

    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]) {
        return from(modules)
            .pipe(
                switchMap((m) => this.downloadIpfsModule(m))
            );
    }

    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig) {
        return this.requestService.get(config.provider + config.hash)
            .pipe(
                take(1),
                map((r: string) => {
                    if (!r) {
                        throw new Error('Recieved undefined from provided address' + config.provider + config.hash);
                    }
                    let res = r;
                    const metaString = '<!--meta-rxdi-ipfs-module-->';
                    if (res.includes(metaString)) {
                        try {
                            res = r.split(metaString)[1];
                        } catch (e) { }
                    }
                    return res;
                }),
                map((r: string) => JSON.parse(r)),
        );
    }

    private combineDependencies(dependencies: any[], config: ExternalImporterIpfsConfig) {
        return combineLatest(dependencies.length ? dependencies.map(d => this.downloadIpfsModule({ provider: config.provider, hash: d })) : of(''));
    }

    downloadIpfsModule(config: ExternalImporterIpfsConfig) {

        if (!config.provider) {
            throw new Error(`Missing configuration inside ${config.hash}`);
        }

        if (!config.hash) {
            throw new Error(`Missing configuration inside ${config.provider}`);
        }
        let folder;
        let moduleLink;
        let configLink = config.provider + config.hash;
        let moduleTypings;
        let moduleName;
        let originalModuleConfig;
        return this.downloadIpfsModuleConfig(config)
            .pipe(
                map((m: { name: string; module: string; typings: string; dependencies: Array<any> }) => {
                    moduleName = m.name;
                    originalModuleConfig = m;
                    folder = `${process.cwd()}/node_modules/`;
                    moduleLink = `${config.provider}${m.module}`;
                    moduleTypings = `${config.provider}${m.typings}`;
                    m.dependencies = m.dependencies || [];
                    this.logger.logFileService(`Package config for module ${moduleName} downloaded! ${JSON.stringify(m)}`);
                    return m;
                }),
                switchMap((m) => this.combineDependencies(m.dependencies, config)),
                switchMap((res) => {
                    console.log(`--------------------${moduleName}--------------------`);
                    console.log(`\nDownloading... ${configLink} `);
                    console.log(`Config: ${JSON.stringify(originalModuleConfig, null, 2)} \n`);
                    return this.requestService.get(moduleLink);
                }),
                switchMap((file) => this.fileService.writeFileAsync(folder + moduleName, 'index.js', moduleName, file)),
                switchMap(() => this.requestService.get(moduleTypings)),
                switchMap((file) => this.fileService.writeFileAsync(folder + `@types/${moduleName}`, 'index.d.ts', moduleName, file))
            );

    }

    downloadTypings(config: ExternalImporterConfig) {
        if (!config.typings) {
            return of(null);
        }
        const moduleName = config.fileName;
        const moduleNamespace = config.namespace;
        const moduleLink = config.typings;
        const modulesFolder = config.outputFolder || `/external_modules/`;
        const folder = `${process.cwd()}${modulesFolder}@types/${moduleNamespace}`;
        const fileName = `${moduleName}.d.ts`;
        return this.requestService.get(moduleLink)
            .pipe(
                take(1),
                map((res) => {
                    this.logger.logFileService(`Done!`);
                    return res;
                }),
                switchMap((res) => this.fileService.writeFileSync(folder, fileName, config.fileName, res))
            );
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
                        switchMap((res) => this.fileService.writeFileSync(folder, fileName, config.fileName, res)),
                        switchMap(() => this.importExternalModule(moduleName)),
                        switchMap(() => this.downloadTypings(config))
                    )
                    .subscribe(
                        (m) => observer.next(m),
                        err => observer.error(err)
                    );
            }
        });
    }
}