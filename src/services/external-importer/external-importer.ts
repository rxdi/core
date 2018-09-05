import { Service } from '../../container';
import { ExternalImporterConfig, ExternalImporterIpfsConfig, ExternalModuleConfiguration } from './external-importer-config';
import { from, Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, take, filter, tap } from 'rxjs/operators';
import { RequestService } from '../request';
import { FileService } from '../file';
import { BootstrapLogger } from '../bootstrap-logger/bootstrap-logger';
import { Injector } from '../../decorators/injector/injector.decorator';
import { CompressionService } from '../compression/compression.service';
import { NpmService } from '../npm-service/npm.service';
import { ConfigService } from '../config';
import { readFileSync, writeFileSync } from 'fs';
import { PackagesConfig } from '../../bin/root';
import SystemJS = require('systemjs');

@Service()
export class ExternalImporter {

    @Injector(RequestService) private requestService: RequestService;
    @Injector(FileService) private fileService: FileService;
    @Injector(BootstrapLogger) private logger: BootstrapLogger;
    @Injector(CompressionService) compressionService: CompressionService;
    @Injector(ConfigService) private configService: ConfigService;
    @Injector(NpmService) private npmService: NpmService;

    defaultProvider: string = 'https://ipfs.io/ipfs/';
    defaultNamespaceFolder: string = '@types';
    defaultOutputFolder: string = 'node_modules';
    defaultPackageJsonFolder: string = `${process.cwd()}/package.json`;
    defaultTypescriptConfigJsonFolder: string = `${process.cwd()}/tsconfig.json`;

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

    loadTypescriptConfigJson() {
        let tsConfig;
        try {
            tsConfig = this.fileService.readFile(this.defaultTypescriptConfigJsonFolder);
        } catch (e) {
            tsConfig = {
                compilerOptions: {
                    typeRoots: []
                } 
            };
        }
        return tsConfig;
    }

    addNamespaceToTypeRoots(namespace: string) {
        const defaultNamespace = `./${this.defaultOutputFolder}/@types/${namespace}`;
        const tsConfig: { compilerOptions: { typeRoots: string[] } } = this.loadTypescriptConfigJson();
        const foundNamespace = tsConfig.compilerOptions.typeRoots.filter((t) => t === defaultNamespace).length;
        if (!foundNamespace) {
            tsConfig.compilerOptions.typeRoots.push(defaultNamespace);
            this.writeTypescriptConfigFile(tsConfig);
        }
        return of(true);
    }

    writeTypescriptConfigFile(file) {
        this.fileService.writeFileSync(process.cwd() + '/tsconfig.json', file);
    }

    loadPackageJson() {
        let packageJson;
        try {
            packageJson = this.fileService.readFile(this.defaultPackageJsonFolder);
        } catch (e) {
            packageJson = {};
        }
        return packageJson;
    }

    isModulePresent(hash) {
        const file = this.loadPackageJson();
        let ipfsConfig: PackagesConfig[] = file.ipfs;
        const found = [];
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        ipfsConfig.forEach(c => {
            const present = c.dependencies.filter(dep => dep === hash);
            if (present.length) {
                found.push(present[0]);
            }
        });
        return found.length;
    }

    filterUniquePackages() {
        const file = this.loadPackageJson();
        let ipfsConfig: PackagesConfig[] = file.ipfs;
        let dups = [];
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        ipfsConfig.forEach(c => {
            const uniq = c.dependencies
                .map((name) => {
                    return { count: 1, name: name };
                })
                .reduce((a, b) => {
                    a[b.name] = (a[b.name] || 0) + b.count;
                    return a;
                }, {});

            const duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
            dups = [...dups, ...duplicates];
        });

        if (dups.length) {
            throw new Error(`There are packages which are with the same hash ${JSON.stringify(dups)}`);
        }
        return dups.length;
    }

    defaultIpfsConfig() {
        return [{ provider: this.defaultProvider, dependencies: [] }];
    }

    addPackageToJson(hash: string) {
        const file = this.loadPackageJson();
        let ipfsConfig: PackagesConfig[] = file.ipfs;
        if (!ipfsConfig) {
            ipfsConfig = this.defaultIpfsConfig();
        }
        if (this.isModulePresent(hash)) {
            this.logger.log(`Package with hash: ${hash} present and will not be downloaded!`);
        } else {
            ipfsConfig[0].dependencies.push(hash);
            file.ipfs = ipfsConfig;
        }
        this.fileService.writeFileSync(this.defaultPackageJsonFolder, file);
    }

    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]) {
        const latest = modules.map(m => this.downloadIpfsModule(m));
        return combineLatest(latest.length ? latest : of());
    }

    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig) {
        return this.requestService.get(config.provider + config.hash, config.hash)
            .pipe(
                map((r) => {
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
                map((r) => {
                    let res = r;
                    try {
                        res = JSON.parse(r);
                    } catch (e) { }
                    return res;
                }),
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
        const configLink = config.provider + config.hash;
        let moduleTypings;
        let moduleName;
        let originalModuleConfig: ExternalModuleConfiguration;
        return this.downloadIpfsModuleConfig(config)
            .pipe(
                tap(res => {
                    if (!res['module']) {
                        console.log('Todo: create logic to load module which is not from rxdi infrastructure for now can be used useDynamic which will do the same job!');
                    }
                }),
                filter((res: ExternalModuleConfiguration) => !!res.module),
                map((externalModule: ExternalModuleConfiguration) => {
                    moduleName = externalModule.name;
                    folder = `${process.cwd()}/${this.defaultOutputFolder}/`;
                    moduleLink = `${config.provider}${externalModule.module}`;
                    moduleTypings = `${config.provider}${externalModule.typings}`;
                    externalModule.dependencies = externalModule.dependencies || [];
                    externalModule.packages = externalModule.packages || [];
                    originalModuleConfig = externalModule;
                    this.npmService.setPackages(externalModule.packages);
                    this.logger.logFileService(`Package config for module ${moduleName} downloaded! ${JSON.stringify(externalModule)}`);
                    return externalModule;
                }),
                switchMap((externalModule) => this.combineDependencies(externalModule.dependencies, config)),
                tap(() => {
                    if (originalModuleConfig.packages.length) {
                        this.npmService.installPackages();
                    }
                }),
                switchMap((res) => {
                    this.logger.logFileService(`--------------------${moduleName}--------------------`);
                    this.logger.logFileService(`\nDownloading... ${configLink} `);
                    this.logger.logFileService(`Config: ${JSON.stringify(originalModuleConfig, null, 2)} \n`);
                    return this.requestService.get(moduleLink, config.hash);
                }),
                switchMap((file) => this.fileService.writeFile(folder + moduleName, 'index.js', moduleName, file)),
                switchMap(() => this.requestService.get(moduleTypings, config.hash)),
                switchMap((file) => this.fileService.writeFile(folder + `${this.defaultNamespaceFolder}/${moduleName}`, 'index.d.ts', moduleName, file)),
                // switchMap(() => this.fileService.writeFileAsyncP(`${folder}${this.defaultNamespaceFolder}/${moduleName.split('/')[0]}`, 'index.d.ts', '')),
                switchMap(() => this.addNamespaceToTypeRoots(moduleName.split('/')[0])),
                map(() => {
                    return {
                        provider: config.provider,
                        hash: config.hash,
                        version: originalModuleConfig.version,
                        name: originalModuleConfig.name,
                        dependencies: originalModuleConfig.dependencies,
                        packages: originalModuleConfig.packages
                    };
                })
            );

    }

    downloadTypings(moduleLink: string, folder, fileName, config: ExternalImporterConfig) {
        if (!moduleLink) {
            return of(true);
        }
        return this.requestService.get(moduleLink)
            .pipe(
                take(1),
                map((res) => {
                    this.logger.logFileService(`Done!`);
                    return res;
                }),
                switchMap((res) => this.fileService.writeFile(folder, fileName, config.typingsFileName, res))
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
            const modulesFolder = config.outputFolder || `/${this.defaultOutputFolder}/`;
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
                        switchMap((res) => this.fileService.writeFile(folder, fileName, config.fileName, res)),
                        switchMap(() => this.downloadTypings(config.typings, folder, fileName, config)),
                        switchMap(() => this.importExternalModule(moduleName)),
                    )
                    .subscribe(
                        (m) => observer.next(m),
                        err => observer.error(err)
                    );
            }
        });
    }
}