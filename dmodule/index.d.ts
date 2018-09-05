declare module '@rxdi/container/types/ObjectType' {
	/**
	 * Special type allows to use Function and get known its type as T.
	 */
	export type ObjectType<T> = {
	    new (...args: any[]): T;
	};

}
declare module '@rxdi/container/Token' {
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
declare module '@rxdi/container/types/ServiceMetadata' {
	import { ObjectType } from '@rxdi/container/types/ObjectType';
	import { Token } from '@rxdi/container/Token';
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
declare module '@rxdi/container/types/ServiceIdentifier' {
	import { Token } from '@rxdi/container/Token';
	/**
	 * Unique service identifier.
	 * Can be some class type, or string id, or instance of Token.
	 */
	export type ServiceIdentifier = Function | Token<any> | string;

}
declare module '@rxdi/container/error/ServiceNotFoundError' {
	import { ServiceIdentifier } from '@rxdi/container/types/ServiceIdentifier';
	/**
	 * Thrown when requested service was not found.
	 */
	export class ServiceNotFoundError extends Error {
	    name: string;
	    constructor(identifier: ServiceIdentifier);
	}

}
declare module '@rxdi/container/error/MissingProvidedServiceTypeError' {
	/**
	 * Thrown when service is registered without type.
	 */
	export class MissingProvidedServiceTypeError extends Error {
	    name: string;
	    constructor(identifier: any);
	}

}
declare module '@rxdi/services/constructor-watcher/constructor-watcher' {
	export class ConstructorWatcherService {
	    _constructors: Map<string, Function>;
	    getConstructor(name: string): Function;
	    getByClass<T>(currentClass: Function): T;
	    createConstructor(name: string, value: any): Function;
	    triggerOnInit(currentClass: Function): void;
	}
	export const constructorWatcherService: ConstructorWatcherService;

}
declare module '@rxdi/services/constructor-watcher/index' {
	export * from '@rxdi/services/constructor-watcher/constructor-watcher';

}
declare module '@rxdi/container/ContainerInstance' {
	import { ServiceMetadata } from '@rxdi/container/types/ServiceMetadata';
	import { ObjectType } from '@rxdi/container/types/ObjectType';
	import { Token } from '@rxdi/container/Token';
	import { ServiceIdentifier } from '@rxdi/container/types/ServiceIdentifier';
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
declare module '@rxdi/container/types/Handler' {
	import { ContainerInstance } from '@rxdi/container/ContainerInstance';
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
declare module '@rxdi/container/Container' {
	import { ServiceMetadata } from '@rxdi/container/types/ServiceMetadata';
	import { ObjectType } from '@rxdi/container/types/ObjectType';
	import { Handler } from '@rxdi/container/types/Handler';
	import { Token } from '@rxdi/container/Token';
	import { ServiceIdentifier } from '@rxdi/container/types/ServiceIdentifier';
	import { ContainerInstance } from '@rxdi/container/ContainerInstance';
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
	    static readonly handlers: Handler[];
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
declare module '@rxdi/container/types/ServiceOptions' {
	import { ObjectType } from '@rxdi/container/types/ObjectType';
	import { Token } from '@rxdi/container/Token';
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
declare module '@rxdi/helpers/create-unique-hash' {
	export function createUniqueHash(key: any): string;

}
declare module '@rxdi/container/decorators/Service' {
	import { ServiceOptions } from '@rxdi/container/types/ServiceOptions';
	import { Token } from '@rxdi/container/Token';
	export interface TypeProvide<T> extends Function {
	    new (...args: any[]): T;
	}
	/**
	 * Marks class as a service that can be injected using Container.
	 */
	export function Service(): Function;
	export function Service(config: {
	    providedIn?: TypeProvide<any> | 'root' | null;
	    useFactory?: () => any;
	}): Function;
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
declare module '@rxdi/services/external-importer/external-importer-systemjs' {
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
declare module '@rxdi/services/external-importer/external-importer-config' {
	import { Config } from '@rxdi/services/external-importer/external-importer-systemjs';
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
	    module: string;
	    typings: string;
	    dependencies?: Array<any>;
	    packages?: NpmPackageConfig[];
	}

}
declare module '@rxdi/decorators/module/module.interfaces' {
	import { PluginInterface } from '@rxdi/container/decorators/Plugin';
	import { ExternalImporterConfig } from '@rxdi/services/external-importer/external-importer-config';
	import { InjectionToken } from '@rxdi/container/Token';
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
	    controllers?: Array<Function | ModuleWithServices>;
	    effects?: Array<Function>;
	    components?: Array<Function>;
	    beforePlugins?: Array<Function | PluginInterface>;
	    plugins?: Array<Function | PluginInterface>;
	    afterPlugins?: Array<Function | PluginInterface>;
	}
	export type DecoratorType = 'module' | 'service' | 'plugin' | 'controller' | 'effect' | 'component';
	export interface Metadata {
	    moduleHash?: string;
	    moduleName?: string;
	    raw?: string;
	    type?: DecoratorType;
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
	}
	export interface ModuleArguments<T, K> extends Metadata {
	    imports?: Array<Function | ModuleWithServices>;
	    services?: Array<Function | ServiceArgumentsInternal>;
	    controllers?: Array<Function | ModuleWithServices>;
	    effects?: Array<Function>;
	    components?: Array<Function>;
	    beforePlugins?: Array<T | PluginInterface>;
	    plugins?: Array<T | PluginInterface>;
	    afterPlugins?: Array<T | PluginInterface>;
	    bootstrap?: Array<Function>;
	}

}
declare module '@rxdi/container/decorators/Plugin' {
	import { ServiceOptions } from '@rxdi/container/types/ServiceOptions';
	import { Token } from '@rxdi/container/Token';
	export interface PluginInterface {
	    name?: string;
	    version?: string;
	    register(server?: any, options?: any): void;
	    handler?(request: any, h: any): any;
	}
	export function Plugin<T, K extends keyof T>(optionsOrServiceName?: ServiceOptions<T, K> | Token<any> | string): Function;

}
declare module '@rxdi/container/error/CannotInjectError' {
	/**
	 * Thrown when DI cannot inject value into property decorated by @Inject decorator.
	 */
	export class CannotInjectError extends Error {
	    name: string;
	    constructor(target: Object, propertyName: string);
	}

}
declare module '@rxdi/container/decorators/Inject' {
	import { Token } from '@rxdi/container/Token';
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

}
declare module '@rxdi/container/decorators/InjectMany' {
	import { Token } from '@rxdi/container/Token';
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
declare module '@rxdi/container/types/hooks/on-before' {
	export interface OnBefore {
	    OnBefore(): void;
	}

}
declare module '@rxdi/container/types/hooks/on-init' {
	export interface OnInit {
	    OnInit(): void;
	}

}
declare module '@rxdi/container/types/hooks/index' {
	export * from '@rxdi/container/types/hooks/on-before';
	export * from '@rxdi/container/types/hooks/on-init';

}
declare module '@rxdi/container/index' {
	export * from '@rxdi/container/decorators/Service';
	export * from '@rxdi/container/decorators/Plugin';
	export * from '@rxdi/container/decorators/Inject';
	export * from '@rxdi/container/decorators/InjectMany';
	export { Container } from '@rxdi/container/Container';
	export { ContainerInstance } from '@rxdi/container/ContainerInstance';
	export { Handler } from '@rxdi/container/types/Handler';
	export { ServiceOptions } from '@rxdi/container/types/ServiceOptions';
	export { ServiceIdentifier } from '@rxdi/container/types/ServiceIdentifier';
	export { ServiceMetadata } from '@rxdi/container/types/ServiceMetadata';
	export { ObjectType } from '@rxdi/container/types/ObjectType';
	export { Token as InjectionToken } from '@rxdi/container/Token';
	export * from '@rxdi/container/types/hooks/index';

}
declare module '@rxdi/services/cache/cache-layer.interfaces' {
	import { Metadata } from '@rxdi/decorators/module/module.interfaces';
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
declare module '@rxdi/services/cache/cache-layer' {
	import { CacheLayerInterface, CacheServiceConfigInterface } from '@rxdi/services/cache/cache-layer.interfaces';
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
declare module '@rxdi/helpers/events' {
	export const InternalEvents: {
	    load: "load";
	    init: "init";
	    config: "config";
	};
	export type InternalEvents = keyof typeof InternalEvents;
	export const InternalLayers: {
	    globalConfig: "globalConfig";
	    modules: "modules";
	};
	export type InternalLayers = keyof typeof InternalLayers;

}
declare module '@rxdi/services/config/config.model' {
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
	    crypto?: PrivateCryptoModel;
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
	}

}
declare module '@rxdi/services/config/config.service' {
	import { ConfigModel } from '@rxdi/services/config/config.model';
	export class ConfigService {
	    config: ConfigModel;
	    setConfig(config: ConfigModel): void;
	}

}
declare module '@rxdi/services/config/index' {
	export * from '@rxdi/services/config/config.model';
	export * from '@rxdi/services/config/config.service';

}
declare module '@rxdi/decorators/injector/injector.decorator' {
	export function Injector<T, K extends keyof T>(Service: T): Function;

}
declare module '@rxdi/services/bootstrap-logger/bootstrap-logger' {
	import { ConfigService } from '@rxdi/services/config/index';
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
declare module '@rxdi/services/bootstrap-logger/index' {
	export * from '@rxdi/services/bootstrap-logger/bootstrap-logger';

}
declare module '@rxdi/services/cache/cache-layer.service' {
	import { BehaviorSubject, Observable } from 'rxjs';
	import { CacheLayer } from '@rxdi/services/cache/cache-layer';
	import { CacheLayerItem, CacheLayerInterface, Duplicates } from '@rxdi/services/cache/cache-layer.interfaces';
	import { BootstrapLogger } from '@rxdi/services/bootstrap-logger/index';
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
	    searchForItem(classItem: any): any;
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
declare module '@rxdi/services/cache/index' {
	export * from '@rxdi/services/cache/cache-layer.service';
	export * from '@rxdi/services/cache/cache-layer';
	export * from '@rxdi/services/cache/cache-layer.interfaces';

}
declare module '@rxdi/services/plugin/plugin.service' {
	import { PluginInterface } from '@rxdi/container/index';
	export class PluginService {
	    private plugins;
	    private beforePlugins;
	    private afterPlugins;
	    register(plugin: any): void;
	    registerBefore(plugin: any): void;
	    registerAfter(plugin: any): void;
	    getPlugins(): Array<Function | PluginInterface>;
	    getAfterPlugins(): (Function | PluginInterface)[];
	    getBeforePlugins(): (Function | PluginInterface)[];
	}

}
declare module '@rxdi/services/exit-handler/exit-handler.service' {
	import { Observable, Subject } from 'rxjs';
	export type NodejsEvents = 'beforeExit' | 'disconnect' | 'exit' | 'rejectionHandled' | 'uncaughtException' | 'unhandledRejection' | 'warning' | 'message' | 'newListener' | 'removeListener';
	export type Signals = 'SIGABRT' | 'SIGALRM' | 'SIGBUS' | 'SIGCHLD' | 'SIGCONT' | 'SIGFPE' | 'SIGHUP' | 'SIGILL' | 'SIGINT' | 'SIGIO' | 'SIGIOT' | 'SIGKILL' | 'SIGPIPE' | 'SIGPOLL' | 'SIGPROF' | 'SIGPWR' | 'SIGQUIT' | 'SIGSEGV' | 'SIGSTKFLT' | 'SIGSTOP' | 'SIGSYS' | 'SIGTERM' | 'SIGTRAP' | 'SIGTSTP' | 'SIGTTIN' | 'SIGTTOU' | 'SIGUNUSED' | 'SIGURG' | 'SIGUSR1' | 'SIGUSR2' | 'SIGVTALRM' | 'SIGWINCH' | 'SIGXCPU' | 'SIGXFSZ' | 'SIGBREAK' | 'SIGLOST' | 'SIGINFO';
	export class ExitHandlerService {
	    errorHandler: Subject<any>;
	    private logger;
	    init(): void;
	    exitHandler(options: any, err: any): void;
	    onExitApp(events: Array<Signals | NodejsEvents>): Observable<{}>;
	}

}
declare module '@rxdi/services/exit-handler/index' {
	export * from '@rxdi/services/exit-handler/exit-handler.service';

}
declare module '@rxdi/services/request/request.cache.service' {
	import { CacheService, CacheLayer, CacheLayerItem } from '@rxdi/services/cache/index';
	export class RequestCacheService extends CacheService {
	    cacheLayer: CacheLayer<CacheLayerItem<any>>;
	    constructor();
	    put(key: any, data: any): CacheLayerItem<any>;
	    get(key: any): CacheLayerItem<any>;
	}

}
declare module '@rxdi/services/request/request.service' {
	import { Observable } from 'rxjs';
	export class RequestService {
	    private cache;
	    private logger;
	    get(link: string, cacheHash?: any): Observable<any>;
	}

}
declare module '@rxdi/services/request/index' {
	export * from '@rxdi/services/request/request.service';
	export * from '@rxdi/services/request/request.cache.service';

}
declare module '@rxdi/services/file/dist' {
	export function mkdirp(p?: any, opts?: any, f?: any, made?: any): void;
	export function mkdirpSync(p?: any, opts?: any, made?: any): any;

}
declare module '@rxdi/services/file/file.service' {
	import { Observable } from 'rxjs';
	export class FileService {
	    private logger;
	    writeFile(folder: string, fileName: any, moduleName: any, file: any): Observable<{}>;
	    writeFileAsync(folder: string, fileName: any, moduleName: any, file: any): Observable<string>;
	    isPresent(path: string): boolean;
	    private writeFileAsyncP;
	    mkdirp(folder: any): Observable<boolean>;
	    fileWalker(dir: any): Observable<string[]>;
	    private filewalker;
	}

}
declare module '@rxdi/services/file/index' {
	export * from '@rxdi/services/file/file.service';

}
declare module '@rxdi/services/compression/compression.service' {
	import { PrivateCryptoModel } from '@rxdi/services/config/index';
	export class CompressionService {
	    private config;
	    gZipFile(input: string, output: string, options?: PrivateCryptoModel): any;
	    readGzipFile(input: string, output: string, options?: PrivateCryptoModel): any;
	    gZipAll(): void;
	}

}
declare module '@rxdi/services/npm-service/npm.service' {
	/// <reference types="node" />
	import { NpmPackageConfig } from '@rxdi/services/external-importer/index';
	import { BehaviorSubject } from 'rxjs';
	import childProcess = require('child_process');
	export class NpmService {
	    packagesToDownload: BehaviorSubject<NpmPackageConfig[]>;
	    packages: string[];
	    child: childProcess.ChildProcess;
	    setPackages(packages: NpmPackageConfig[]): void;
	    preparePackages(): void;
	    installPackages(): void;
	}

}
declare module '@rxdi/bin/root' {
	import { ExternalImporterIpfsConfig } from '@rxdi/services/external-importer/external-importer-config';
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
declare module '@rxdi/services/external-importer/external-importer' {
	import { ExternalImporterConfig, ExternalImporterIpfsConfig } from '@rxdi/services/external-importer/external-importer-config';
	import { Observable } from 'rxjs';
	import { CompressionService } from '@rxdi/services/compression/compression.service';
	export class ExternalImporter {
	    private requestService;
	    private fileService;
	    private logger;
	    compressionService: CompressionService;
	    private configService;
	    private npmService;
	    defaultProvider: string;
	    defaultNamespaceFolder: string;
	    defaultOutputFolder: string;
	    defaultPackageJsonFolder: string;
	    importExternalModule(module: string): Observable<any>;
	    validateConfig(config: ExternalImporterConfig): void;
	    encryptFile(fileFullPath: string): any;
	    decryptFile(fileFullPath: string): any;
	    isWeb(): boolean;
	    loadPackageJson(): any;
	    isModulePresent(hash: any): number;
	    filterUniquePackages(): number;
	    defaultIpfsConfig(): {
	        provider: string;
	        dependencies: any[];
	    }[];
	    addPackageToJson(hash: string): void;
	    downloadIpfsModules(modules: ExternalImporterIpfsConfig[]): Observable<any[]>;
	    downloadIpfsModuleConfig(config: ExternalImporterIpfsConfig): Observable<any>;
	    private combineDependencies;
	    downloadIpfsModule(config: ExternalImporterIpfsConfig): any;
	    downloadTypings(moduleLink: string, folder: any, fileName: any, config: ExternalImporterConfig): Observable<{}>;
	    importModule(config: ExternalImporterConfig, token: string): Promise<any>;
	}

}
declare module '@rxdi/services/external-importer/index' {
	export * from '@rxdi/services/external-importer/external-importer';
	export * from '@rxdi/services/external-importer/external-importer-config';

}
declare module '@rxdi/services/lazy-factory/lazy-factory.service' {
	import { Observable } from 'rxjs';
	export class LazyFactory {
	    lazyFactories: Map<any, any>;
	    setLazyFactory(provide: string, factory: Observable<Function> | Promise<Function>): any;
	    getLazyFactory(provide: string): any;
	}

}
declare module '@rxdi/services/module/helpers/validators' {
	import { Metadata, DecoratorType } from '@rxdi/decorators/module/module.interfaces';
	export class ModuleValidators {
	    validateEmpty(m: any, original: {
	        metadata: Metadata;
	    }, type: DecoratorType): void;
	    genericWrongPluggableError(m: any, original: {
	        metadata: Metadata;
	    }, type: DecoratorType): void;
	    validateImports(m: any, original: {
	        metadata: Metadata;
	    }): void;
	    validateServices(m: any, original: {
	        metadata: Metadata;
	    }): void;
	    validatePlugin(m: any, original: {
	        metadata: Metadata;
	    }): void;
	    validateController(m: any, original: {
	        metadata: Metadata;
	    }): void;
	    validateEffect(m: any, original: {
	        metadata: Metadata;
	    }): void;
	    validateComponent(m: any, original: {
	        metadata: Metadata;
	    }): void;
	}

}
declare module '@rxdi/services/controllers/controllers.service' {
	export class ControllersService {
	    private controllers;
	    register(plugin: any): void;
	    getControllers(): Function[];
	}

}
declare module '@rxdi/services/effect/effect.service' {
	export class EffectsService {
	    private effects;
	    register(plugin: any): void;
	    getEffects(): Function[];
	}

}
declare module '@rxdi/services/components/components.service' {
	export class ComponentsService {
	    private components;
	    register(plugin: any): void;
	    getComponents(): Function[];
	}

}
declare module '@rxdi/services/bootstraps/bootstraps.service' {
	export class BootstrapsServices {
	    private bootstraps;
	    register(plugin: any): void;
	    getBootstraps(): Function[];
	}

}
declare module '@rxdi/services/services/services.service' {
	export class ServicesService {
	    private services;
	    register(plugin: any): void;
	    getServices(): Function[];
	}

}
declare module '@rxdi/services/module/module.service' {
	import { ServiceArgumentsInternal, Metadata } from '@rxdi/decorators/module/module.interfaces';
	import { ConstructorWatcherService } from '@rxdi/services/constructor-watcher/constructor-watcher';
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
	    setServices(services: ServiceArgumentsInternal[], original: {
	        metadata: Metadata;
	    }, currentModule: any): void;
	    setInjectedDependencies(service: any): void;
	    setUseValue(service: any): void;
	    setUseClass(service: any): void;
	    setUseDynamic(service: any): void;
	    setUseFactory(service: any): void;
	    setControllers(controllers: any[], original: any, currentModule: any): void;
	    setEffects(effects: any[], original: any, currentModule: any): void;
	    setComponents(components: any[], original: any, currentModule: any): void;
	    setPlugins(plugins: any, original: {
	        metadata: Metadata;
	    }, currentModule: any): void;
	    setBootstraps(bootstraps: any, original: {
	        metadata: Metadata;
	    }, currentModule: any): void;
	    setAfterPlugins(plugins: any, original: {
	        metadata: Metadata;
	    }, currentModule: any): void;
	    setBeforePlugins(plugins: any, original: {
	        metadata: Metadata;
	    }, currentModule: any): void;
	    setImports(imports: any, original: {
	        metadata: Metadata;
	    }): void;
	}

}
declare module '@rxdi/services/module/index' {
	export * from '@rxdi/services/module/module.service';
	export * from '@rxdi/services/module/helpers/validators';

}
declare module '@rxdi/services/resolver/resolver.service' {
	import { Observable } from 'rxjs';
	export class ResolverService {
	    private bootstrapLogger;
	    private cacheService;
	    resolveDependencies(hash: any, target: any, moduleName: any): Observable<any[]>;
	    private resolveContainerDependencies;
	}

}
declare module '@rxdi/services/resolver/index' {
	export * from '@rxdi/services/resolver/resolver.service';

}
declare module '@rxdi/services/plugin-manager/plugin-manager' {
	import { PluginService } from '@rxdi/services/plugin/plugin.service';
	import { PluginInterface } from '@rxdi/container/index';
	export class PluginManager {
	    private pluginService;
	    constructor(pluginService: PluginService);
	    listPlugins(): Array<Function | PluginInterface>;
	    getPlugin(pluginClass: Function): Function | PluginInterface;
	}

}
declare module '@rxdi/services/after-starter/after-starter.service' {
	import { Subject } from 'rxjs';
	export class AfterStarterService {
	    appStarted: Subject<boolean>;
	}

}
declare module '@rxdi/services/bootstrap/bootstrap.service' {
	import { Observable } from 'rxjs';
	import { BootstrapLogger } from '@rxdi/services/bootstrap-logger/bootstrap-logger';
	import { CacheService } from '@rxdi/services/cache/cache-layer.service';
	import { LazyFactory } from '@rxdi/services/lazy-factory/lazy-factory.service';
	import { ConfigService } from '@rxdi/services/config/config.service';
	import { PluginService } from '@rxdi/services/plugin/plugin.service';
	import { ConfigModel } from '@rxdi/services/config/config.model';
	import { CacheLayer, CacheLayerItem } from '@rxdi/services/cache/index';
	import { EffectsService } from '@rxdi/services/effect/effect.service';
	import { ControllersService } from '@rxdi/services/controllers/controllers.service';
	import { ComponentsService } from '@rxdi/services/components/components.service';
	import { BootstrapsServices } from '@rxdi/services/bootstraps/bootstraps.service';
	import { ServicesService } from '@rxdi/services/services/services.service';
	import { PluginManager } from '@rxdi/services/plugin-manager/plugin-manager';
	import { AfterStarterService } from '@rxdi/services/after-starter/after-starter.service';
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
	    private pluginManager;
	    private afterStarterService;
	    globalConfig: CacheLayer<CacheLayerItem<ConfigModel>>;
	    chainableObservable: Observable<boolean>;
	    asyncChainables: Observable<any>[];
	    config: ConfigModel;
	    constructor(logger: BootstrapLogger, cacheService: CacheService, lazyFactoriesService: LazyFactory, configService: ConfigService, controllersService: ControllersService, effectsService: EffectsService, pluginService: PluginService, componentsService: ComponentsService, bootstrapsService: BootstrapsServices, servicesService: ServicesService, pluginManager: PluginManager, afterStarterService: AfterStarterService);
	    start(app: any, config?: ConfigModel): Observable<{}>;
	    private final;
	    private asyncChainablePluginsRegister;
	    private asyncChainableComponents;
	    private asyncChainableBootstraps;
	    private asyncChainableEffects;
	    private asyncChainableServices;
	    private asyncChainableControllers;
	    private asyncChainablePluginsAfterRegister;
	    private asyncChainablePluginsBeforeRegister;
	    private registerPlugin;
	    private prepareAsyncChainables;
	    private validateSystem;
	    private attachLazyLoadedChainables;
	    loadApplication(): boolean;
	}

}
declare module '@rxdi/helpers/exit-handler' {
	export const exitHandlerInit: () => void;

}
declare module '@rxdi/helpers/bootstrap' {
	import 'reflect-metadata';
	import { ConfigModel } from '@rxdi/services/config/config.model';
	import { Observable } from 'rxjs';
	export const Bootstrap: (app: any, config?: ConfigModel) => Observable<any>;
	export const BootstrapPromisify: (app: any, config?: ConfigModel) => Promise<any>;
	export const BootstrapFramework: (app: any, modules: any[], config?: ConfigModel) => Observable<any>;

}
declare module '@rxdi/helpers/index' {
	export * from '@rxdi/helpers/bootstrap';
	export * from '@rxdi/helpers/create-unique-hash';
	export * from '@rxdi/helpers/generic-constructor';

}
declare module '@rxdi/services/metadata/metadata.service' {
	export class MetadataService {
	    generateHashData(module: any, original: Function): any[][];
	    validateCustomInjectableKeys(keys: Array<'useFactory' | 'provide' | 'useValue' | 'useClass' | 'useDynamic' | string>): void;
	    validateCustomInjectable(injectable: any, module: any, original: any): void;
	    parseModuleTemplate(moduleName: any, generatedHashData: any, targetCurrentSymbol: any): string;
	    createUniqueHash(string: string): string;
	}

}
declare module '@rxdi/services/metadata/index' {
	export * from '@rxdi/services/metadata/metadata.service';

}
declare module '@rxdi/services/compression/index' {
	export * from '@rxdi/services/compression/compression.service';

}
declare module '@rxdi/services/effect/index' {
	export * from '@rxdi/services/effect/effect.service';

}
declare module '@rxdi/services/controllers/index' {
	export * from '@rxdi/services/controllers/controllers.service';

}
declare module '@rxdi/services/components/index' {
	export * from '@rxdi/services/components/components.service';

}
declare module '@rxdi/services/bootstraps/index' {
	export * from '@rxdi/services/bootstraps/bootstraps.service';

}
declare module '@rxdi/services/services/index' {
	export * from '@rxdi/services/services/services.service';

}
declare module '@rxdi/services/index' {
	export * from '@rxdi/services/cache/index';
	export * from '@rxdi/services/plugin/plugin.service';
	export * from '@rxdi/services/bootstrap-logger/index';
	export * from '@rxdi/services/exit-handler/index';
	export * from '@rxdi/services/external-importer/index';
	export * from '@rxdi/services/module/index';
	export * from '@rxdi/services/resolver/index';
	export * from '@rxdi/services/config/index';
	export * from '@rxdi/services/metadata/index';
	export * from '@rxdi/services/compression/index';
	export * from '@rxdi/services/file/index';
	export * from '@rxdi/services/constructor-watcher/index';
	export * from '@rxdi/services/effect/index';
	export * from '@rxdi/services/controllers/index';
	export * from '@rxdi/services/components/index';
	export * from '@rxdi/services/bootstraps/index';
	export * from '@rxdi/services/services/index';
	export * from '@rxdi/services/plugin-manager/plugin-manager';
	export * from '@rxdi/services/after-starter/after-starter.service';

}
declare module '@rxdi/helpers/generic-constructor' {
	export function GenericConstruct(module: any, original: any, currentModule: any): (constructor: any, args: any) => any;

}
declare module '@rxdi/decorators/module/module.decorator' {
	import { ModuleArguments } from '@rxdi/decorators/module/module.interfaces';
	export function Module<T, K extends keyof T>(module?: ModuleArguments<T, K>): Function;

}
declare module '@rxdi/decorators/module/index' {
	export * from '@rxdi/decorators/module/module.decorator';
	export * from '@rxdi/decorators/module/module.interfaces';

}
declare module '@rxdi/decorators/injector/index' {
	export * from '@rxdi/decorators/injector/injector.decorator';

}
declare module '@rxdi/decorators/inject-soft/inject-soft.decorator' {
	export function InjectSoft<T>(Service: Function): T;

}
declare module '@rxdi/decorators/inject-soft/index' {
	export * from '@rxdi/decorators/inject-soft/inject-soft.decorator';

}
declare module '@rxdi/decorators/controller/controller.decorator' {
	export function Controller<T>(options?: T | {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/decorators/controller/index' {
	export * from '@rxdi/decorators/controller/controller.decorator';

}
declare module '@rxdi/decorators/effect/effect.decorator' {
	export function Effect<T, K extends keyof T>(options?: {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/decorators/effect/index' {
	export * from '@rxdi/decorators/effect/effect.decorator';

}
declare module '@rxdi/decorators/component/component.decorator' {
	export function Component<T, K extends keyof T>(options?: {
	    init?: boolean;
	}): Function;

}
declare module '@rxdi/decorators/component/index' {
	export * from '@rxdi/decorators/component/component.decorator';

}
declare module '@rxdi/decorators/index' {
	export * from '@rxdi/decorators/module/index';
	export * from '@rxdi/decorators/injector/index';
	export * from '@rxdi/decorators/inject-soft/index';
	export * from '@rxdi/decorators/controller/index';
	export * from '@rxdi/decorators/effect/index';
	export * from '@rxdi/decorators/component/index';

}
declare module '@rxdi' {
	export * from '@rxdi/container/index';
	export * from '@rxdi/decorators/index';
	export * from '@rxdi/helpers/index';
	export * from '@rxdi/services/index';
}

declare module '@rxdi/core' {
	export * from '@rxdi/container/index';
	export * from '@rxdi/decorators/index';
	export * from '@rxdi/helpers/index';
	export * from '@rxdi/services/index';
}
