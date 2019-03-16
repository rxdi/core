import { ContainerInstance } from './ContainerInstance';
import { Token } from './Token';
import { Handler } from './types/Handler';
import { ObjectType } from './types/ObjectType';
import { ServiceIdentifier } from './types/ServiceIdentifier';
import { ServiceMetadata } from './types/ServiceMetadata';
/**
 * Service container.
 */
export declare class Container {
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
