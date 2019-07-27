declare module '@rxdi/core/container/types/ObjectType' {
	/**
	 * Special type allows to use Function and get known its type as T.
	 */
	export type ObjectType<T> = {
	    new (...args: any[]): T;
	};

}
declare module '@rxdi/core/container/Token' {
	/**
	 * Used to create unique typed service identifier.
	 * Useful when service has only interface, but don't have a class.
	 */
	export class Token<T> {
	    name?: string;
	    /**
	     * @param name Token name, optional and only used for debugging purposes.
	     */
	    constructor(name?: string);
	}
	export class InjectionToken<T> extends Token<T> {
	}

}
declare module '@rxdi/core/container/types/ServiceOptions' {
	import { ObjectType } from '@rxdi/core/container/types/ObjectType';
	import { Token } from '@rxdi/core/container/Token';
	/**
	 * Service options passed to the @Service() decorator.
	 * Allows to specify service id and/or factory used to create this service.
	 */
	export interface ServiceOptions<T, K extends keyof T> {
	    /**
	     * Indicates if this service must be global and same instance must be used across all containers.
	     */
	    global?: boolean;
	    /**
	     * Represents wheather or not this particular container should be resolved on start
	     */
	    init?: boolean;
	    /**
	     * Indicates if instance of this class must be created on each its request.
	     * Global option is ignored when this option is used.
	     */
	    transient?: boolean;
	    /**
	     * Allows to setup multiple instances the different classes under a single service id string or token.
	     */
	    multiple?: boolean;
	    /**
	     * Unique service id.
	     */
	    id?: string | Token<any>;
	    /**
	     * Factory used to produce this service.
	     */
	    factory?: [ObjectType<T>, K] | ((...params: any[]) => any);
	}

}
declare module '@rxdi/core/decorators/plugin/Plugin' {
	export interface PluginInterface {
	    name?: string;
	    version?: string;
	    register(server?: any, options?: any): void;
	    handler?(request: any, h: any): any;
	}
	export function Plugin(options?: any): Function;

}
declare module '@rxdi/core/services/external-importer/external-importer-systemjs' {
	export type ModuleFormat = 'esm' | 'cjs' | 'amd' | 'global' | 'register';
	export interface MetaConfig {
	    /**
	     * Sets in what format the module is loaded.
	     */
	    format?: ModuleFormat;
	    /**
	     * For the global format, when automatic detection of exports is not enough, a custom exports meta value can be set.
	     * This tells the loader what global name to use as the module's export value.
	     */
	    exports?: string;
	    /**
	     * Dependencies to load before this module. Goes through regular paths and map normalization.
	     * Only supported for the cjs, amd and global formats.
	     */
	    deps?: string[];
	    /**
	     * A map of global names to module names that should be defined only for the execution of this module.
	     * Enables use of legacy code that expects certain globals to be present.
	     * Referenced modules automatically becomes dependencies. Only supported for the cjs and global formats.
	     */
	    globals?: string;
	    /**
	     * Set a loader for this meta path.
	     */
	    loader?: string;
	    /**
	     * For plugin transpilers to set the source map of their transpilation.
	     */
	    sourceMap?: any;
	    /**
	     * Load the module using <script> tag injection.
	     */
	    scriptLoad?: boolean;
	    /**
	     * The nonce attribute to use when loading the script as a way to enable CSP.
	     * This should correspond to the 'nonce-' attribute set in the Content-Security-Policy header.
	     */
	    nonce?: string;
	    /**
	     * The subresource integrity attribute corresponding to the script integrity,
	     * describing the expected hash of the final code to be executed.
	     * For example, System.config({ meta: { 'src/example.js': { integrity: 'sha256-e3b0c44...' }});
	     * would throw an error if the translated source of src/example.js doesn't match the expected hash.
	     */
	    integrity?: string;
	    /**
	     * When scripts are loaded from a different domain (e.g. CDN) the global error handler (window.onerror)
	     * has very limited information about errors to prevent unintended leaking. In order to mitigate this,
	     * the <script> tags need to set crossorigin attribute and the server needs to enable CORS.
	     * The valid values are 'anonymous' and 'use-credentials'.
	     */
	    crossOrigin?: string;
	    /**
	     * When loading a module that is not an ECMAScript Module, we set the module as the default export,
	     * but then also iterate the module object and copy named exports for it a well.
	     * Use this option to disable this iteration and copying of the exports.
	     */
	    esmExports?: boolean;
	    /**
	     * To ignore resources that shouldn't be traced as part of the build.
	     * Use with the SystemJS Builder. (https://github.com/systemjs/builder#ignore-resources)
	     */
	    build?: boolean;
	    /**
	     * A truthy value enables sending credentials to the server on every request. Additionally, a string value adds
	     * an 'Authorization' header with that value to all requests.
	     */
	    authorization?: string | boolean;
	}
	export interface PackageConfig {
	    /**
	     * The main entry point of the package (so import 'local/package' is equivalent to import 'local/package/index.js')
	     */
	    main?: string;
	    /**
	     * The module format of the package. See Module Formats.
	     */
	    format?: ModuleFormat;
	    /**
	     * The default extension to add to modules requested within the package. Takes preference over defaultJSExtensions.
	     * Can be set to defaultExtension: false to optionally opt-out of extension-adding when defaultJSExtensions is enabled.
	     */
	    defaultExtension?: boolean | string;
	    /**
	     * Local and relative map configurations scoped to the package. Apply for subpaths as well.
	     */
	    map?: ConfigMap;
	    /**
	     * Module meta provides an API for SystemJS to understand how to load modules correctly.
	     * Package-scoped meta configuration with wildcard support. Modules are subpaths within the package path.
	     * This also provides an opt-out mechanism for defaultExtension, by adding modules here that should skip extension adding.
	     */
	    meta?: ConfigMeta;
	}
	export type ConfigMeta = PackageList<MetaConfig>;
	export interface ModulesList {
	    [bundleName: string]: string[];
	}
	export interface PackageList<T> {
	    [packageName: string]: T;
	}
	export type ConfigMap = PackageList<string | PackageList<string>>;
	export type Transpiler = 'plugin-traceur' | 'plugin-babel' | 'plugin-typescript' | 'traceur' | 'babel' | 'typescript' | false;
	export interface TraceurOptions {
	    properTailCalls?: boolean;
	    symbols?: boolean;
	    arrayComprehension?: boolean;
	    asyncFunctions?: boolean;
	    asyncGenerators?: any;
	    forOn?: boolean;
	    generatorComprehension?: boolean;
	}
	export interface Config {
	    /**
	     * For custom config names
	     */
	    [customName: string]: any;
	    /**
	     * The baseURL provides a special mechanism for loading modules relative to a standard reference URL.
	     */
	    baseURL?: string;
	    /**
	     * Set the Babel transpiler options when System.transpiler is set to babel.
	     */
	    babelOptions?: any;
	    /**
	     * undles allow a collection of modules to be downloaded together as a package whenever any module from that collection is requested.
	     * Useful for splitting an application into sub-modules for production. Use with the SystemJS Builder.
	     */
	    bundles?: ModulesList;
	    /**
	     * Backwards-compatibility mode for the loader to automatically add '.js' extensions when not present to module requests.
	     * This allows code written for SystemJS 0.16 or less to work easily in the latest version:
	     */
	    defaultJSExtensions?: boolean;
	    /**
	     * An alternative to bundling providing a solution to the latency issue of progressively loading dependencies.
	     * When a module specified in depCache is loaded, asynchronous loading of its pre-cached dependency list begins in parallel.
	     */
	    depCache?: ModulesList;
	    /**
	     * The map option is similar to paths, but acts very early in the normalization process.
	     * It allows you to map a module alias to a location or package:
	     */
	    map?: ConfigMap;
	    /**
	     * Module meta provides an API for SystemJS to understand how to load modules correctly.
	     * Meta is how we set the module format of a module, or know how to shim dependencies of a global script.
	     */
	    meta?: ConfigMeta;
	    /**
	     * Packages provide a convenience for setting meta and map configuration that is specific to a common path.
	     * In addition packages allow for setting contextual map configuration which only applies within the package itself.
	     * This allows for full dependency encapsulation without always needing to have all dependencies in a global namespace.
	     */
	    packages?: PackageList<PackageConfig>;
	    /**
	     * The ES6 Module Loader paths implementation, applied after normalization and supporting subpaths via wildcards.
	     * It is usually advisable to use map configuration over paths unless you need strict control over normalized module names.
	     */
	    paths?: PackageList<string>;
	    /**
	     * Set the Traceur compilation options.
	     */
	    traceurOptions?: TraceurOptions;
	    /**
	     * Sets the module name of the transpiler to be used for loading ES6 modules.
	     */
	    transpiler?: Transpiler;
	    trace?: boolean;
	    /**
	     * Sets the TypeScript transpiler options.
	     */
	    typescriptOptions?: {
	        /**
	         * A boolean flag which instructs the plugin to load configuration from 'tsconfig.json'.
	         * To override the location of the file set this option to the path of the configuration file,
	         * which will be resolved using normal SystemJS resolution.
	         * Note: This setting is specific to plugin-typescript.
	         */
	        tsconfig?: boolean | string;
	        [key: string]: any;
	    };
	}

}
declare module '@rxdi/core/services/external-importer/external-importer-config' {
	import { Config } from '@rxdi/core/services/external-importer/external-importer-systemjs';
	export class ExternalImporterConfig {
	    link: string;
	    fileName?: string;
	    typings?: string;
	    typingsFileName?: string;
	    namespace?: string;
	    extension?: string;
	    crypto?: {
	        cyperKey: string;
	        cyperIv: string;
	        algorithm: string;
	    };
	    SystemJsConfig?: Config;
	    outputFolder?: string | '/node_modules/';
	}
	export class ExternalImporterIpfsConfig {
	    provider: string;
	    hash: string;
	}
	export interface NpmPackageConfig {
	    name: string;
	    version: string;
	}
	export interface ExternalModuleConfiguration {
	    name: string;
	    version: string;
	    typings: string;
	    module: string;
	    dependencies?: Array<any>;
	    packages?: NpmPackageConfig[];
	}

}
declare module '@rxdi/core/decorators/module/module.interfaces' {
	import { PluginInterface } from '@rxdi/core/decorators/plugin/Plugin';
	import { ExternalImporterConfig } from '@rxdi/core/services/external-importer/external-importer-config';
	import { InjectionToken } from '@rxdi/core/container/Token';
	export interface ServiceArguments {
	    name?: string;
	    provide: string | InjectionToken<any> | Function;
	    useValue?: any;
	    useFactory?: Function;
	    useClass?: any;
	    metadata?: Metadata;
	    useDynamic?: ExternalImporterConfig;
	    deps?: Array<Function | InjectionToken<any>>;
	    lazy?: boolean;
	}
	export interface ModuleWithServices {
	    module?: Function;
	    frameworkImports?: Array<Function | ModuleWithServices>;
	    services?: Array<ServiceArguments | Function>;
	    providers?: Array<ServiceArguments | Function>;
	    controllers?: Array<Function | ModuleWithServices>;
	    effects?: Array<Function>;
	    components?: Array<Function>;
	    beforePlugins?: Array<Function | PluginInterface>;
	    plugins?: Array<Function | PluginInterface>;
	    afterPlugins?: Array<Function | PluginInterface>;
	    /** @angular module compatability */
	    ngModule?: Function;
	}
	export interface ModuleWithProviders extends ModuleWithServices {
	}
	export type DecoratorType = 'module' | 'service' | 'plugin' | 'controller' | 'effect' | 'component';
	export type SystemIngridientsType = 'plugins' | 'pluginsBefore' | 'pluginsAfter' | 'controllers' | 'services' | 'effects' | 'components';
	export interface Metadata {
	    moduleHash?: string;
	    moduleName?: string;
	    raw?: string;
	    type?: DecoratorType;
	    options?: any;
	}
	export interface ServiceArgumentsInternal {
	    name?: string;
	    provide: Function | string | InjectionToken<any>;
	    useValue?: any;
	    useFactory?: Function;
	    useClass?: any;
	    metadata?: Metadata;
	    useDynamic?: ExternalImporterConfig;
	    deps?: Array<Function | string | InjectionToken<any>>;
	    lazy?: boolean;
	    originalName?: string;
	    forRoot?: any;
	}
	export interface ModuleArguments<T, K> extends Metadata {
	    imports?: Array<Function | ModuleWithServices>;
	    services?: Array<Function | ServiceArgumentsInternal>;
	    providers?: Array<Function | ServiceArgumentsInternal>;
	    controllers?: Array<Function | ModuleWithServices>;
	    effects?: Array<Function>;
	    components?: Array<Function>;
	    beforePlugins?: Array<T | PluginInterface>;
	    plugins?: Array<T | PluginInterface>;
	    afterPlugins?: Array<T | PluginInterface>;
	    bootstrap?: Array<Function>;
	}

}
declare module '@rxdi/core/services/cache/cache-layer.interfaces' {
	import { Metadata } from '@rxdi/core/decorators/module/module.interfaces';
	export interface CacheLayerItem<T> {
	    key: string;
	    data: T;
	}
	export class CacheServiceConfigInterface {
	    deleteOnExpire?: string;
	    cacheFlushInterval?: number | null;
	    maxAge?: number | null;
	    localStorage?: boolean;
	}
	export interface CacheLayerInterface {
	    name: string;
	    config?: CacheServiceConfigInterface;
	    items?: any;
	}
	export interface Duplicates extends Metadata {
	    dupeName: string;
	    originalName: string;
	    class: Function;
	}

}
declare module '@rxdi/core/services/cache/cache-layer' {
	import { CacheLayerInterface, CacheServiceConfigInterface } from '@rxdi/core/services/cache/cache-layer.interfaces';
	import { BehaviorSubject, Observable } from 'rxjs';
	export class CacheLayer<T> {
	    items: BehaviorSubject<Array<T>>;
	    name: string;
	    config: CacheServiceConfigInterface;
	    map: Map<any, any>;
	    get(name: any): T;
	    constructor(layer: CacheLayerInterface);
	    private initHook;
	    private onExpireAll;
	    private putItemHook;
	    getItem(key: string): T;
	    putItem(layerItem: T): T;
	    private onExpire;
	    removeItem(key: string): void;
	    getItemObservable(key: string): Observable<T>;
	    flushCache(): Observable<boolean>;
	}

}
declare module '@rxdi/core/helpers/events' {
	export const InternalEvents: {
	    load: "load";
	    config: "config";
	};
	export type InternalEvents = keyof typeof InternalEvents;
	export const InternalLayers: {
	    globalConfig: "globalConfig";
	    modules: "modules";
	};
	export type InternalLayers = keyof typeof InternalLayers;

}
declare module '@rxdi/core/services/config/config.model' {
	export class LoggerConfig {
	    logging?: boolean;
	    hashes?: boolean;
	    date?: boolean;
	    exitHandler?: boolean;
	    fileService?: boolean;
	}
	export class PrivateCryptoModel {
	    algorithm?: string;
	    cyperIv?: string;
	    cyperKey?: string;
	}
	export class ExperimentalFeatures {
	    logExtendedInjectables?: boolean;
	    showModuleWithDependencies?: boolean;
	}
	export class InitOptionsConfig {
	    services?: boolean;
	    controllers?: boolean;
	    effects?: boolean;
	    pluginsBefore?: boolean;
	    plugins?: boolean;
	    components?: boolean;
	    pluginsAfter?: any;
	}
	export class ConfigModel {
	    init?: boolean;
	    initOptions?: InitOptionsConfig;
	    experimental?: ExperimentalFeatures;
	    logger?: LoggerConfig;
	    strict?: boolean;
	}

}
declare module '@rxdi/core/services/config/config.service' {
	import { ConfigModel } from '@rxdi/core/services/config/config.model';
	export class ConfigService {
	    config: ConfigModel;
	    setConfig(config: ConfigModel): void;
	}

}
declare module '@rxdi/core/services/config/index' {
	export * from '@rxdi/core/services/config/config.model';
	export * from '@rxdi/core/services/config/config.service';

}
declare module '@rxdi/core/decorators/injector/injector.decorator' {
	export function Injector<T>(Service: T): Function;

}
declare module '@rxdi/core/services/bootstrap-logger/bootstrap-logger' {
	import { ConfigService } from '@rxdi/core/services/config/index';
	export class BootstrapLogger {
	    configService: ConfigService;
	    log(message: string): string[];
	    error(message: string): void;
	    logImporter(message: string): string[];
	    logDate(): string;
	    logFileService(message: string): string;
	    logHashes(message: string): string;
	    logExitHandler(message: string): string;
	}

}
declare module '@rxdi/core/services/bootstrap-logger/index' {
	export * from '@rxdi/core/services/bootstrap-logger/bootstrap-logger';

}
declare module '@rxdi/core/services/cache/cache-layer.service' {
	import { BehaviorSubject, Observable } from 'rxjs';
	import { CacheLayer } from '@rxdi/core/services/cache/cache-layer';
	import { CacheLayerItem, CacheLayerInterface, Duplicates } from '@rxdi/core/services/cache/cache-layer.interfaces';
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	import { BootstrapLogger } from '@rxdi/core/services/bootstrap-logger/index';
	export class CacheService {
	    private logger;
	    constructor(logger: BootstrapLogger);
	    _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
	    map: Map<any, any>;
	    config: any;
	    static createCacheInstance<T>(cacheLayer: any): CacheLayer<CacheLayerItem<T>>;
	    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
	    getLayersByName<T>(name: string): CacheLayer<CacheLayerItem<T>>[];
	    searchForDuplicateDependenciesInsideApp(): string[];
	    private isExcludedEvent;
	    searchForItem(classItem: Function): ServiceArgumentsInternal;
	    searchForDuplicatesByHash(key: string): Duplicates[];
	    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
	    private LayerHook;
	    private protectLayerFromInvaders;
	    private OnExpire;
	    removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void;
	    transferItems(name: string, newCacheLayers: CacheLayerInterface[]): CacheLayer<CacheLayerItem<any>>[];
	    flushCache(): Observable<boolean>;
	}

}
declare module '@rxdi/core/services/cache/index' {
	export * from '@rxdi/core/services/cache/cache-layer.service';
	export * from '@rxdi/core/services/cache/cache-layer';
	export * from '@rxdi/core/services/cache/cache-layer.interfaces';

}
declare module '@rxdi/core/services/plugin/plugin.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class PluginService {
	    private plugins;
	    private beforePlugins;
	    private afterPlugins;
	    register(plugin: any): void;
	    registerBefore(plugin: any): void;
	    registerAfter(plugin: any): void;
	    getPlugins(): Array<ServiceArgumentsInternal>;
	    getAfterPlugins(): ServiceArgumentsInternal[];
	    getBeforePlugins(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/exit-handler/exit-handler.service' {
	import { Observable, Subject } from 'rxjs';
	export type NodejsEvents = 'beforeExit' | 'disconnect' | 'exit' | 'rejectionHandled' | 'uncaughtException' | 'unhandledRejection' | 'warning' | 'message' | 'newListener' | 'removeListener';
	export type Signals = 'SIGABRT' | 'SIGALRM' | 'SIGBUS' | 'SIGCHLD' | 'SIGCONT' | 'SIGFPE' | 'SIGHUP' | 'SIGILL' | 'SIGINT' | 'SIGIO' | 'SIGIOT' | 'SIGKILL' | 'SIGPIPE' | 'SIGPOLL' | 'SIGPROF' | 'SIGPWR' | 'SIGQUIT' | 'SIGSEGV' | 'SIGSTKFLT' | 'SIGSTOP' | 'SIGSYS' | 'SIGTERM' | 'SIGTRAP' | 'SIGTSTP' | 'SIGTTIN' | 'SIGTTOU' | 'SIGUNUSED' | 'SIGURG' | 'SIGUSR1' | 'SIGUSR2' | 'SIGVTALRM' | 'SIGWINCH' | 'SIGXCPU' | 'SIGXFSZ' | 'SIGBREAK' | 'SIGLOST' | 'SIGINFO';
	export class ExitHandlerService {
	    errorHandler: Subject<any>;
	    private logger;
	    init(): void;
	    exitHandler(options: any, err: any): void;
	    onExitApp(events: Array<Signals>): Observable<unknown>;
	}

}
declare module '@rxdi/core/services/exit-handler/index' {
	export * from '@rxdi/core/services/exit-handler/exit-handler.service';

}
declare module '@rxdi/core/services/request/request.cache.service' {
	import { CacheService, CacheLayer, CacheLayerItem } from '@rxdi/core/services/cache/index';
	export class RequestCacheService extends CacheService {
	    cacheLayer: CacheLayer<CacheLayerItem<any>>;
	    constructor();
	    put(key: any, data: any): CacheLayerItem<any>;
	    get(key: any): CacheLayerItem<any>;
	}

}
declare module '@rxdi/core/services/request/request.service' {
	import { Observable } from 'rxjs';
	export class RequestService {
	    private cache;
	    private logger;
	    get(link: string, cacheHash?: any): Observable<any>;
	}

}
declare module '@rxdi/core/services/request/index' {
	export * from '@rxdi/core/services/request/request.service';
	export * from '@rxdi/core/services/request/request.cache.service';

}
declare module '@rxdi/core/services/file/dist' {
	export function mkdirp(p?: any, opts?: any, f?: any, made?: any): void;
	export function mkdirpSync(p?: any, opts?: any, made?: any): any;

}
declare module '@rxdi/core/services/file/file.service' {
	import { Observable } from 'rxjs';
	export class FileService {
	    private logger;
	    writeFile(folder: string, fileName: any, moduleName: any, file: any): Observable<unknown>;
	    writeFileAsync(folder: string, fileName: any, moduleName: any, file: any): Observable<string>;
	    writeFileSync(folder: any, file: any): any;
	    readFile(file: string): any;
	    isPresent(path: string): boolean;
	    writeFileAsyncP(folder: any, fileName: any, content: any): Observable<unknown>;
	    mkdirp(folder: any): Observable<boolean>;
	    fileWalker(dir: string, exclude?: string): Observable<string[]>;
	    private filewalker;
	}

}
declare module '@rxdi/core/services/file/index' {
	export * from '@rxdi/core/services/file/file.service';

}
declare module '@rxdi/core/services/compression/compression.service' {
	export class CompressionService {
	    private config;
	    gZipAll(): void;
	}

}
declare module '@rxdi/core/services/npm-service/npm.service' {
	/// <reference types="node" />
	import { NpmPackageConfig } from '@rxdi/core/services/external-importer/index';
	import { BehaviorSubject } from 'rxjs';
	import childProcess = require('child_process');
	export class NpmService {
	    packagesToDownload: BehaviorSubject<NpmPackageConfig[]>;
	    packages: string[];
	    child: childProcess.ChildProcess;
	    setPackages(packages: NpmPackageConfig[]): void;
	    preparePackages(): void;
	    installPackages(): Promise<unknown>;
	}

}
declare module '@rxdi/core/container/error/MissingProvidedServiceTypeError' {
	/**
	 * Thrown when service is registered without type.
	 */
	export class MissingProvidedServiceTypeError extends Error {
	    name: string;
	    constructor(identifier: any);
	}

}
declare module '@rxdi/core/container/types/ServiceIdentifier' {
	import { Token } from '@rxdi/core/container/Token';
	/**
	 * Unique service identifier.
	 * Can be some class type, or string id, or instance of Token.
	 */
	export type ServiceIdentifier<T = any> = Function | Token<T> | string | {
	    service: T;
	};

}
declare module '@rxdi/core/container/error/ServiceNotFoundError' {
	import { ServiceIdentifier } from '@rxdi/core/container/types/ServiceIdentifier';
	/**
	 * Thrown when requested service was not found.
	 */
	export class ServiceNotFoundError extends Error {
	    name: string;
	    constructor(identifier: ServiceIdentifier);
	}

}
declare module '@rxdi/core/container/types/ServiceMetadata' {
	import { ObjectType } from '@rxdi/core/container/types/ObjectType';
	import { Token } from '@rxdi/core/container/Token';
	/**
	 * Service metadata is used to initialize service and store its state.
	 */
	export interface ServiceMetadata<T, K extends keyof T> {
	    /**
	     * Class type of the registering service.
	     * Can be omitted only if instance is set.
	     * If id is not set then it serves as service id.
	     */
	    type?: Function;
	    /**
	     * Indicates if this service must be global and same instance must be used across all containers.
	     */
	    global?: boolean;
	    /**
	     * Indicates if instance of this class must be created on each its request.
	     * Global option is ignored when this option is used.
	     */
	    transient?: boolean;
	    /**
	     * Allows to setup multiple instances the different classes under a single service id string or token.
	     */
	    multiple?: boolean;
	    /**
	     * Service unique identifier.
	     */
	    id?: Token<any> | string | Function;
	    /**
	     * Factory function used to initialize this service.
	     * Can be regular function ('createCar' for example),
	     * or other service which produces this instance ([CarFactory, 'createCar'] for example).
	     */
	    factory?: [ObjectType<T>, K] | ((...params: any[]) => any);
	    /**
	     * Instance of the target class.
	     */
	    value?: any;
	}

}
declare module '@rxdi/core/services/constructor-watcher/constructor-watcher' {
	export class ConstructorWatcherService {
	    _constructors: Map<string, Function>;
	    getConstructor(name: string): Function;
	    getByClass<T>(currentClass: Function): T;
	    createConstructor(name: string, value: any): Function;
	    triggerOnInit(currentClass: Function): void;
	}
	export const constructorWatcherService: ConstructorWatcherService;

}
declare module '@rxdi/core/services/constructor-watcher/index' {
	export * from '@rxdi/core/services/constructor-watcher/constructor-watcher';

}
declare module '@rxdi/core/container/ContainerInstance' {
	import { Token } from '@rxdi/core/container/Token';
	import { ObjectType } from '@rxdi/core/container/types/ObjectType';
	import { ServiceIdentifier } from '@rxdi/core/container/types/ServiceIdentifier';
	import { ServiceMetadata } from '@rxdi/core/container/types/ServiceMetadata';
	/**
	 * TypeDI can have multiple containers.
	 * One container is ContainerInstance.
	 */
	export class ContainerInstance {
	    /**
	     * Container instance id.
	     */
	    id: any;
	    /**
	     * All registered services.
	     */
	    private services;
	    constructor(id: any);
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    has<T>(type: ObjectType<T>): boolean;
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    has<T>(id: string): boolean;
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    has<T>(id: Token<T>): boolean;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    get<T>(type: ObjectType<T>): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    get<T>(id: string): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    get<T>(id: Token<T>): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    get<T>(id: {
	        service: T;
	    }): T;
	    /**
	     * Gets all instances registered in the container of the given service identifier.
	     * Used when service defined with multiple: true flag.
	     */
	    getMany<T>(id: string): T[];
	    /**
	     * Gets all instances registered in the container of the given service identifier.
	     * Used when service defined with multiple: true flag.
	     */
	    getMany<T>(id: Token<T>): T[];
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set<T, K extends keyof T>(service: ServiceMetadata<T, K>): this;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set(type: Function, value: any): this;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set(name: string, value: any): this;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set(token: Token<any>, value: any): this;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set(token: ServiceIdentifier, value: any): this;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    set<T, K extends keyof T>(values: ServiceMetadata<T, K>[]): this;
	    /**
	     * Removes services with a given service identifiers (tokens or types).
	     */
	    remove(...ids: ServiceIdentifier[]): this;
	    /**
	     * Completely resets the container by removing all previously registered services from it.
	     */
	    reset(): this;
	    /**
	     * Filters registered service in the with a given service identifier.
	     */
	    private filterServices;
	    /**
	     * Finds registered service in the with a given service identifier.
	     */
	    private findService;
	    /**
	     * Gets service value.
	     */
	    private getServiceValue;
	    /**
	     * Initializes all parameter types for a given target service class.
	     */
	    private initializeParams;
	    /**
	     * Checks if given type is primitive (e.g. string, boolean, number, object).
	     */
	    private isTypePrimitive;
	    /**
	     * Applies all registered handlers on a given target class.
	     */
	    private applyPropertyHandlers;
	}

}
declare module '@rxdi/core/container/types/Handler' {
	import { ContainerInstance } from '@rxdi/core/container/ContainerInstance';
	/**
	 * Used to register special 'handler' which will be executed on a service class during its initialization.
	 * It can be used to create custom decorators and set/replace service class properties and constructor parameters.
	 */
	export interface Handler {
	    /**
	     * Service object used to apply handler to.
	     */
	    object: Object;
	    /**
	     * Class property name to set/replace value of.
	     * Used if handler is applied on a class property.
	     */
	    propertyName?: string;
	    /**
	     * Parameter index to set/replace value of.
	     * Used if handler is applied on a constructor parameter.
	     */
	    index?: number;
	    /**
	     * Factory function that produces value that will be set to class property or constructor parameter.
	     * Accepts container instance which requested the value.
	     */
	    value: (container: ContainerInstance) => any;
	}

}
declare module '@rxdi/core/container/Container' {
	import { ContainerInstance } from '@rxdi/core/container/ContainerInstance';
	import { Token } from '@rxdi/core/container/Token';
	import { Handler } from '@rxdi/core/container/types/Handler';
	import { ObjectType } from '@rxdi/core/container/types/ObjectType';
	import { ServiceIdentifier } from '@rxdi/core/container/types/ServiceIdentifier';
	import { ServiceMetadata } from '@rxdi/core/container/types/ServiceMetadata';
	/**
	 * Service container.
	 */
	export class Container {
	    /**
	     * Global container instance.
	     */
	    private static readonly globalInstance;
	    /**
	     * Other containers created using Container.of method.
	     */
	    private static readonly instances;
	    /**
	     * All registered handlers.
	     */
	    static readonly handlers: Map<Handler, Handler>;
	    /**
	     * Gets a separate container instance for the given instance id.
	     */
	    static of(instanceId: any): ContainerInstance;
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static has<T>(type: ObjectType<T>): boolean;
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static has<T>(id: string): boolean;
	    /**
	     * Checks if the service with given name or type is registered service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static has<T>(id: Token<T>): boolean;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static get<T>(type: ObjectType<T>): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static get<T>(id: string): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static get<T>(id: Token<T>): T;
	    /**
	     * Retrieves the service with given name or type from the service container.
	     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
	     */
	    static get<T>(service: {
	        service: T;
	    }): T;
	    /**
	     * Gets all instances registered in the container of the given service identifier.
	     * Used when service defined with multiple: true flag.
	     */
	    static getMany<T>(id: string): T[];
	    /**
	     * Gets all instances registered in the container of the given service identifier.
	     * Used when service defined with multiple: true flag.
	     */
	    static getMany<T>(id: Token<T>): T[];
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    static set<T, K extends keyof T>(service: ServiceMetadata<T, K>): Container;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    static set(type: Function, value: any): Container;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    static set(name: string, value: any): Container;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    static set(token: Token<any>, value: any): Container;
	    /**
	     * Sets a value for the given type or service name in the container.
	     */
	    static set<T, K extends keyof T>(values: ServiceMetadata<T, K>[]): Container;
	    /**
	     * Removes services with a given service identifiers (tokens or types).
	     */
	    static remove(...ids: ServiceIdentifier[]): Container;
	    /**
	     * Completely resets the container by removing all previously registered services and handlers from it.
	     */
	    static reset(containerId?: any): Container;
	    /**
	     * Registers a new handler.
	     */
	    static registerHandler(handler: Handler): Container;
	    /**
	     * Helper method that imports given services.
	     */
	    static import(services: Function[]): Container;
	}

}
declare module '@rxdi/core/bin/root' {
	#!/usr/bin/env node
	import { ExternalImporterIpfsConfig } from '@rxdi/core/services/external-importer/external-importer-config';
	import { Observable } from 'rxjs';
	export interface PackagesConfig {
	    dependencies: string[];
	    provider: string;
	}
	export const loadDeps: (jsonIpfs: PackagesConfig) => {
	    hash: string;
	    provider: string;
	}[];
	export const DownloadDependencies: (dependencies: ExternalImporterIpfsConfig[]) => Observable<any>;

}
declare module '@rxdi/core/services/external-importer/providers' {
	export const IPFS_PROVIDERS: {
	    name: IPFS_PROVIDERS;
	    link: string;
	}[];
	export type IPFS_PROVIDERS = 'cloudflare' | 'main-ipfs-node' | 'local' | 'infura';

}
declare module '@rxdi/core/services/external-importer/external-importer' {
	import { ExternalImporterConfig, ExternalImporterIpfsConfig } from '@rxdi/core/services/external-importer/external-importer-config';
	import { Observable, BehaviorSubject } from 'rxjs';
	import { CompressionService } from '@rxdi/core/services/compression/compression.service';
	import { IPFS_PROVIDERS } from '@rxdi/core/services/external-importer/providers';
	export class ExternalImporter {
	    defaultJsonFolder: string;
	    defaultTypescriptConfigJsonFolder: string;
	    private requestService;
	    private fileService;
	    private logger;
	    compressionService: CompressionService;
	    private npmService;
	    providers: BehaviorSubject<{
	        name: IPFS_PROVIDERS;
	        link: string;
	    }[]>;
	    defaultProvider: string;
	    defaultNamespaceFolder: string;
	    defaultOutputFolder: string;
	    setDefaultProvider(provider: IPFS_PROVIDERS): void;
	    getProvider(name: IPFS_PROVIDERS): string;
	    setProviders(...args: {
	        name: IPFS_PROVIDERS;
	        link: string;
	    }[]): void;
	    importExternalModule(module: string): Observable<any>;
	    validateConfig(config: ExternalImporterConfig): void;
	    isWeb(): boolean;
	    loadTypescriptConfigJson(): {
	        compilerOptions?: {
	            typeRoots?: string[];
	        };
	    };
	    addNamespaceToTypeRoots(namespace: string): Observable<boolean>;
	    writeTypescriptConfigFile(file: any): void;
	    loadPackageJson(): any;
	    loadNpmPackageJson(): any;
	    prepareDependencies(): {
	        name: string;
	        version: any;
	    }[];
	    isModulePresent(hash: any): number;
	    filterUniquePackages(): number;
	    defaultIpfsConfig(): {
	        provider: string;
	        dependencies: any[];
	    }[];
	    addPackageToJson(hash: string): void;
	    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<[any]>;
	    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<any>;
	    private combineDependencies;
	    private writeFakeIndexIfMultiModule;
	    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
	    downloadTypings(moduleLink: string, folder: string, fileName: string, config: ExternalImporterConfig): Observable<unknown>;
	    importModule(config: ExternalImporterConfig, token: string, { folderOverride, waitUntil }?: any): Promise<any>;
	}

}
declare module '@rxdi/core/services/external-importer/index' {
	export * from '@rxdi/core/services/external-importer/external-importer';
	export * from '@rxdi/core/services/external-importer/external-importer-config';

}
declare module '@rxdi/core/services/lazy-factory/lazy-factory.service' {
	import { Observable } from 'rxjs';
	export class LazyFactory {
	    lazyFactories: Map<any, any>;
	    setLazyFactory(provide: string, factory: Observable<Function> | Promise<Function>): any;
	    getLazyFactory(provide: string): any;
	}

}
declare module '@rxdi/core/services/module/helpers/validators' {
	import { DecoratorType, ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class ModuleValidators {
	    validateEmpty(m: any, original: ServiceArgumentsInternal, type: DecoratorType): void;
	    genericWrongPluggableError(m: any, original: ServiceArgumentsInternal, type: DecoratorType): void;
	    validateImports(m: any, original: ServiceArgumentsInternal): void;
	    validateServices(m: any, original: ServiceArgumentsInternal): void;
	    validatePlugin(m: any, original: ServiceArgumentsInternal): void;
	    validateController(m: any, original: ServiceArgumentsInternal): void;
	    validateEffect(m: any, original: ServiceArgumentsInternal): void;
	    validateComponent(m: any, original: ServiceArgumentsInternal): void;
	}

}
declare module '@rxdi/core/services/controllers/controllers.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class ControllersService {
	    private controllers;
	    register(plugin: any): void;
	    getControllers(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/effect/effect.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class EffectsService {
	    private effects;
	    register(plugin: any): void;
	    getEffects(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/components/components.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class ComponentsService {
	    private components;
	    register(plugin: any): void;
	    getComponents(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/bootstraps/bootstraps.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class BootstrapsServices {
	    private bootstraps;
	    register(plugin: any): void;
	    getBootstraps(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/services/services.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class ServicesService {
	    private services;
	    register(plugin: any): void;
	    getServices(): ServiceArgumentsInternal[];
	}

}
declare module '@rxdi/core/services/module/module.service' {
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	import { ConstructorWatcherService } from '@rxdi/core/services/constructor-watcher/constructor-watcher';
	import { CacheLayer, CacheLayerItem } from '@rxdi/core/services/cache/';
	export class ModuleService {
	    watcherService: ConstructorWatcherService;
	    private lazyFactoryService;
	    private pluginService;
	    private componentsService;
	    private controllersService;
	    private effectsService;
	    private bootstraps;
	    private externalImporter;
	    private validators;
	    private servicesService;
	    setServices(services: ServiceArgumentsInternal[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setInjectedDependencies(service: any): void;
	    setUseValue(service: any): void;
	    setUseClass(service: any): void;
	    setUseDynamic(service: any): void;
	    setUseFactory(service: any): void;
	    setControllers(controllers: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setEffects(effects: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setComponents(components: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setPlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setBootstraps(bootstraps: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setAfterPlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setBeforePlugins(plugins: Function[], original: ServiceArgumentsInternal, currentModule: CacheLayer<CacheLayerItem<Function>>): void;
	    setImports(imports: Function[], original: ServiceArgumentsInternal): void;
	}

}
declare module '@rxdi/core/services/module/index' {
	export * from '@rxdi/core/services/module/module.service';
	export * from '@rxdi/core/services/module/helpers/validators';

}
declare module '@rxdi/core/services/resolver/resolver.service' {
	import { Observable } from 'rxjs';
	export class ResolverService {
	    private bootstrapLogger;
	    private cacheService;
	    resolveDependencies(hash: any, target: any, moduleName: any): Observable<any[]>;
	    private resolveContainerDependencies;
	}

}
declare module '@rxdi/core/services/resolver/index' {
	export * from '@rxdi/core/services/resolver/resolver.service';

}
declare module '@rxdi/core/services/after-starter/after-starter.service' {
	import { Subject } from 'rxjs';
	export class AfterStarterService {
	    appStarted: Subject<boolean>;
	}

}
declare module '@rxdi/core/helpers/log' {
	export const logExtendedInjectables: (name: {
	    name: string;
	}, logExtendedInjectables: boolean) => void;

}
declare module '@rxdi/core/services/bootstrap/bootstrap.service' {
	import { Observable } from 'rxjs';
	import { BootstrapLogger } from '@rxdi/core/services/bootstrap-logger/bootstrap-logger';
	import { CacheService } from '@rxdi/core/services/cache/cache-layer.service';
	import { LazyFactory } from '@rxdi/core/services/lazy-factory/lazy-factory.service';
	import { ConfigService } from '@rxdi/core/services/config/config.service';
	import { PluginService } from '@rxdi/core/services/plugin/plugin.service';
	import { ConfigModel } from '@rxdi/core/services/config/config.model';
	import { EffectsService } from '@rxdi/core/services/effect/effect.service';
	import { ControllersService } from '@rxdi/core/services/controllers/controllers.service';
	import { ComponentsService } from '@rxdi/core/services/components/components.service';
	import { BootstrapsServices } from '@rxdi/core/services/bootstraps/bootstraps.service';
	import { ServicesService } from '@rxdi/core/services/services/services.service';
	import { AfterStarterService } from '@rxdi/core/services/after-starter/after-starter.service';
	export class BootstrapService {
	    private logger;
	    private cacheService;
	    private lazyFactoriesService;
	    configService: ConfigService;
	    private controllersService;
	    private effectsService;
	    private pluginService;
	    private componentsService;
	    private bootstrapsService;
	    private servicesService;
	    private afterStarterService;
	    private globalConfig;
	    constructor(logger: BootstrapLogger, cacheService: CacheService, lazyFactoriesService: LazyFactory, configService: ConfigService, controllersService: ControllersService, effectsService: EffectsService, pluginService: PluginService, componentsService: ComponentsService, bootstrapsService: BootstrapsServices, servicesService: ServicesService, afterStarterService: AfterStarterService);
	    start(app: any, config?: ConfigModel): Observable<{}>;
	    private final;
	    private asyncChainableComponents;
	    private asyncChainableBootstraps;
	    private asyncChainableEffects;
	    private asyncChainableServices;
	    private asyncChainableControllers;
	    private asyncChainablePluginsRegister;
	    private asyncChainablePluginsAfterRegister;
	    private asyncChainablePluginsBeforeRegister;
	    private genericFilter;
	    private registerPlugin;
	    private prepareAsyncChainables;
	    private validateSystem;
	    private attachLazyLoadedChainables;
	    loadApplication(): boolean;
	}

}
declare module '@rxdi/core/helpers/exit-handler' {
	export const exitHandlerInit: () => void;

}
declare module '@rxdi/core/helpers/bootstrap' {
	import 'reflect-metadata';
	import { Container } from '@rxdi/core/container';
	import { ConfigModel } from '@rxdi/core/services/config/config.model';
	import { Observable } from 'rxjs';
	import { ModuleArguments } from '@rxdi/core/decorators/module/module.interfaces';
	export const Bootstrap: (app: any, config?: ConfigModel) => Observable<Container>;
	export const BootstrapPromisify: (app: any, config?: ConfigModel) => Promise<Container>;
	export const BootstrapFramework: (app: any, modules: any[], config?: ConfigModel) => Observable<Container>;
	export const setup: <T, K>(options: ModuleArguments<T, K>, frameworks?: any[], bootstrapOptions?: ConfigModel) => Observable<Container>;
	export const createTestBed: <T, K>(options: ModuleArguments<T, K>, frameworks?: any[], bootstrapOptions?: ConfigModel) => Observable<Container>;

}
declare module '@rxdi/core/helpers/sha256' {
	export class Sha256 {
	    /**
	     * Generates SHA-256 hash of string.
	     *
	     * @param   {string} msg - (Unicode) string to be hashed.
	     * @param   {Object} [options]
	     * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
	     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
	     * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
	     *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
	     * @returns {string} Hash of msg as hex character string.
	     */
	    hash(msg: any, options?: any): any;
	    /**
	     * Rotates right (circular right shift) value x by n positions [§3.2.4].
	     * @private
	     */
	    ROTR(n: any, x: any): number;
	    /**
	     * Logical functions [§4.1.2].
	     * @private
	     */
	    Σ0(x: any): number;
	    Σ1(x: any): number;
	    σ0(x: any): number;
	    σ1(x: any): number;
	    Ch(x: any, y: any, z: any): number;
	    Maj(x: any, y: any, z: any): number;
	}
	export const sha256: Sha256;

}
declare module '@rxdi/core/helpers/create-unique-hash' {
	export function createUniqueHash(key: any): any;

}
declare module '@rxdi/core/helpers/index' {
	export * from '@rxdi/core/helpers/bootstrap';
	export * from '@rxdi/core/helpers/create-unique-hash';
	export * from '@rxdi/core/helpers/generic-constructor';
	export * from '@rxdi/core/helpers/sha256';

}
declare module '@rxdi/core/services/metadata/metadata.service' {
	export class MetadataService {
	    generateHashData(module: any, original: any): any[][];
	    validateCustomInjectableKeys(keys: Array<'useFactory' | 'provide' | 'useValue' | 'useClass' | 'useDynamic' | string>): void;
	    validateCustomInjectable(injectable: any, module: any, original: any): void;
	    parseModuleTemplate(moduleName: any, generatedHashData: any, targetCurrentSymbol: any): string;
	    createUniqueHash(string: string): any;
	}

}
declare module '@rxdi/core/services/metadata/index' {
	export * from '@rxdi/core/services/metadata/metadata.service';

}
declare module '@rxdi/core/services/compression/index' {
	export * from '@rxdi/core/services/compression/compression.service';

}
declare module '@rxdi/core/services/effect/index' {
	export * from '@rxdi/core/services/effect/effect.service';

}
declare module '@rxdi/core/services/controllers/index' {
	export * from '@rxdi/core/services/controllers/controllers.service';

}
declare module '@rxdi/core/services/components/index' {
	export * from '@rxdi/core/services/components/components.service';

}
declare module '@rxdi/core/services/bootstraps/index' {
	export * from '@rxdi/core/services/bootstraps/bootstraps.service';

}
declare module '@rxdi/core/services/services/index' {
	export * from '@rxdi/core/services/services/services.service';

}
declare module '@rxdi/core/services/plugin-manager/plugin-manager' {
	import { PluginService } from '@rxdi/core/services/plugin/plugin.service';
	import { ServiceArgumentsInternal } from '@rxdi/core/decorators/module/module.interfaces';
	export class PluginManager {
	    private pluginService;
	    constructor(pluginService: PluginService);
	    listPlugins(): Array<ServiceArgumentsInternal>;
	    getPlugin(pluginClass: Function): ServiceArgumentsInternal;
	}

}
declare module '@rxdi/core/services/index' {
	export * from '@rxdi/core/services/cache/index';
	export * from '@rxdi/core/services/plugin/plugin.service';
	export * from '@rxdi/core/services/bootstrap-logger/index';
	export * from '@rxdi/core/services/exit-handler/index';
	export * from '@rxdi/core/services/external-importer/index';
	export * from '@rxdi/core/services/module/index';
	export * from '@rxdi/core/services/resolver/index';
	export * from '@rxdi/core/services/config/index';
	export * from '@rxdi/core/services/metadata/index';
	export * from '@rxdi/core/services/compression/index';
	export * from '@rxdi/core/services/file/index';
	export * from '@rxdi/core/services/constructor-watcher/index';
	export * from '@rxdi/core/services/effect/index';
	export * from '@rxdi/core/services/controllers/index';
	export * from '@rxdi/core/services/components/index';
	export * from '@rxdi/core/services/bootstraps/index';
	export * from '@rxdi/core/services/services/index';
	export * from '@rxdi/core/services/plugin-manager/plugin-manager';
	export * from '@rxdi/core/services/after-starter/after-starter.service';

}
declare module '@rxdi/core/helpers/generic-constructor' {
	import { CacheLayer, CacheLayerItem } from '@rxdi/core/services';
	export function GenericConstruct(module: any, original: any, currentModule: CacheLayer<CacheLayerItem<Function>>): (constructor: any, args: any) => any;

}
declare module '@rxdi/core/decorators/module/module.decorator' {
	import { ModuleArguments } from '@rxdi/core/decorators/module/module.interfaces';
	export function Module<T, K extends keyof T>(module?: ModuleArguments<T, K>): Function;
	/** @angular module compatability */
	export const NgModule: typeof Module;

}
declare module '@rxdi/core/decorators/module/index' {
	export * from '@rxdi/core/decorators/module/module.decorator';
	export * from '@rxdi/core/decorators/module/module.interfaces';

}
declare module '@rxdi/core/decorators/injector/index' {
	export * from '@rxdi/core/decorators/injector/injector.decorator';

}
declare module '@rxdi/core/decorators/inject-soft/inject-soft.decorator' {
	export function InjectSoft<T>(Service: Function): T;

}
declare module '@rxdi/core/decorators/inject-soft/index' {
	export * from '@rxdi/core/decorators/inject-soft/inject-soft.decorator';

}
declare module '@rxdi/core/container/error/CannotInjectError' {
	/**
	 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
	 */
	export class CannotInjectError extends Error {
	    name: string;
	    constructor(target: Object, propertyName: string);
	}

}
declare module '@rxdi/core/container/types/type-or-name' {
	import { Token } from '@rxdi/core/container/Token';
	export type TypeOrName = ((type?: any) => Function) | string | Token<any>;

}
declare module '@rxdi/core/helpers/get-identifier' {
	import { TypeOrName } from '@rxdi/core/container/types/type-or-name';
	export const getIdentifier: (typeOrName: TypeOrName, target: Object, propertyName: string) => any;
	export const isClient: () => boolean;

}
declare module '@rxdi/core/decorators/inject/Inject' {
	import { Token } from '@rxdi/core/container/Token';
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function Inject(type?: (type?: any) => Function): Function;
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function Inject(serviceName?: string): Function;
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function Inject(token: Token<any>): Function;
	export function Inject(fn: Function): Function;

}
declare module '@rxdi/core/decorators/controller/controller.decorator' {
	export function Controller<T>(options?: T | {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/core/decorators/controller/index' {
	export * from '@rxdi/core/decorators/controller/controller.decorator';

}
declare module '@rxdi/core/decorators/effect/effect.decorator' {
	export function Effect(options?: {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/core/decorators/effect/index' {
	export * from '@rxdi/core/decorators/effect/effect.decorator';

}
declare module '@rxdi/core/decorators/component/component.decorator' {
	export function Component(options?: {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/core/decorators/component/index' {
	export * from '@rxdi/core/decorators/component/component.decorator';

}
declare module '@rxdi/core/decorators/inject-many/InjectMany' {
	import { Token } from '@rxdi/core/container/Token';
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function InjectMany(type?: (type?: any) => Function): Function;
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function InjectMany(serviceName?: string): Function;
	/**
	 * Injects a service into a class property or constructor parameter.
	 */
	export function InjectMany(token: Token<any>): Function;

}
declare module '@rxdi/core/decorators/index' {
	export * from '@rxdi/core/decorators/module/index';
	export * from '@rxdi/core/decorators/injector/index';
	export * from '@rxdi/core/decorators/inject-soft/index';
	export * from '@rxdi/core/decorators/inject/Inject';
	export * from '@rxdi/core/decorators/controller/index';
	export * from '@rxdi/core/decorators/effect/index';
	export * from '@rxdi/core/decorators/plugin/Plugin';
	export * from '@rxdi/core/decorators/service/Service';
	export * from '@rxdi/core/decorators/component/index';
	export * from '@rxdi/core/decorators/inject-many/InjectMany';
	export { Service as Injectable } from '@rxdi/core/decorators/service/Service';

}
declare module '@rxdi/core/helpers/reflect.decorator' {
	import { Metadata } from '@rxdi/core/decorators';
	export function ReflectDecorator<T, K extends keyof T>(options: any, metaOptions: Metadata): (target: Function) => void;

}
declare module '@rxdi/core/decorators/service/Service' {
	import { ServiceOptions } from '@rxdi/core/container/types/ServiceOptions';
	import { Token } from '@rxdi/core/container/Token';
	export interface TypeProvide<T> extends Function {
	    new (...args: any[]): T;
	}
	/**
	 * Marks class as a service that can be injected using Container.
	 */
	export function Service(): Function;
	/**
	 * Marks class as a service that can be injected using Container.
	 */
	export function Service(name: string): Function;
	/**
	 * Marks class as a service that can be injected using Container.
	 */
	export function Service(token: Token<any>): Function;
	/**
	 * Marks class as a service that can be injected using Container.
	 */
	export function Service<T, K extends keyof T>(options?: ServiceOptions<T, K>): Function;

}
declare module '@rxdi/core/container/types/hooks/on-before' {
	export interface OnBefore {
	    OnBefore(): void;
	}

}
declare module '@rxdi/core/container/types/hooks/on-init' {
	export interface OnInit {
	    OnInit(): void;
	}

}
declare module '@rxdi/core/container/types/hooks/index' {
	export * from '@rxdi/core/container/types/hooks/on-before';
	export * from '@rxdi/core/container/types/hooks/on-init';

}
declare module '@rxdi/core/container/index' {
	export { Service as Injectable } from '@rxdi/core/decorators/service/Service';
	export { Container } from '@rxdi/core/container/Container';
	export { ContainerInstance } from '@rxdi/core/container/ContainerInstance';
	export { Handler } from '@rxdi/core/container/types/Handler';
	export { ServiceOptions } from '@rxdi/core/container/types/ServiceOptions';
	export { ServiceIdentifier } from '@rxdi/core/container/types/ServiceIdentifier';
	export { ServiceMetadata } from '@rxdi/core/container/types/ServiceMetadata';
	export { ObjectType } from '@rxdi/core/container/types/ObjectType';
	export { Token as InjectionToken } from '@rxdi/core/container/Token';
	export * from '@rxdi/core/container/types/hooks/index';

}
declare module '@rxdi/core' {
	import 'reflect-metadata';
	export * from '@rxdi/core/container/index';
	export * from '@rxdi/core/decorators/index';
	export * from '@rxdi/core/helpers/index';
	export * from '@rxdi/core/services/index';

}
declare module '@rxdi/core/decorators/injector/injector.decorator.spec' {
	import 'jest';

}
declare module '@rxdi/core/services/bootstrap/index' {
	export * from '@rxdi/core/services/bootstrap/bootstrap.service';

}
declare module '@rxdi/core/services/constructor-watcher/constructor-watcher.spec' {
	import 'jest';
	export class TestService {
	    id: number;
	}

}
declare module '@rxdi/core/services/controllers/controllers.service.spec' {
	import 'jest';

}
declare module '@rxdi/core/services/effect/effect.service.spec' {
	import 'jest';

}
declare module '@rxdi/core/services/external-importer/external-importer.spec' {
	import 'jest';

}
declare module '@rxdi/core/services/metadata/metadata.service.spec' {
	import 'jest';

}
declare module '@rxdi/core/services/npm-service/index' {
	export * from '@rxdi/core/services/npm-service/npm.service';

}
declare module '@rxdi/core/services/request/request.service.spec' {
	import 'jest';

}
