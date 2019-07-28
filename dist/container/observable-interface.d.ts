import { Handler } from './types/Handler';
import { ContainerInstance } from './ContainerInstance';
import { ObjectType } from './types/ObjectType';
import { Token } from './Token';
import { ServiceMetadata } from './types/ServiceMetadata';
import { Container } from './Container';
import { ServiceIdentifier } from './types/ServiceIdentifier';
export interface ObservableContainer {
    /**
     * All registered handlers.
     */
    readonly handlers: Map<Handler, Handler>;
    /**
     * Gets a separate container instance for the given instance id.
     */
    of(instanceId: any): ContainerInstance;
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
    get<T>(service: {
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
    set<T, K extends keyof T>(service: ServiceMetadata<T, K>): Container;
    /**
     * Sets a value for the given type or service name in the container.
     */
    set(type: Function, value: any): Container;
    /**
     * Sets a value for the given type or service name in the container.
     */
    set(name: string, value: any): Container;
    /**
     * Sets a value for the given type or service name in the container.
     */
    set(token: Token<any>, value: any): Container;
    /**
     * Sets a value for the given type or service name in the container.
     */
    set<T, K extends keyof T>(values: ServiceMetadata<T, K>[]): Container;
    /**
     * Removes services with a given service identifiers (tokens or types).
     */
    remove(...ids: ServiceIdentifier[]): Container;
    /**
     * Completely resets the container by removing all previously registered services and handlers from it.
     */
    reset(containerId?: any): Container;
    /**
     * Registers a new handler.
     */
    registerHandler(handler: Handler): Container;
    /**
     * Helper method that imports given services.
     */
    import(services: Function[]): Container;
}
