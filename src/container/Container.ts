import { ContainerInstance } from './ContainerInstance';
import { Token } from './Token';
import { Handler } from './types/Handler';
import { ObjectType } from './types/ObjectType';
import { ServiceIdentifier } from './types/ServiceIdentifier';
import { ServiceMetadata } from './types/ServiceMetadata';

/**
 * Service container.
 */
export class Container {
  // -------------------------------------------------------------------------
  // Private Static Properties
  // -------------------------------------------------------------------------

  /**
   * Global container instance.
   */
  private static readonly globalInstance: ContainerInstance = new ContainerInstance(
    undefined
  );

  /**
   * Other containers created using Container.of method.
   */
  private static readonly instances: Map<string, ContainerInstance> = new Map();

  /**
   * All registered handlers.
   */
  static readonly handlers: Map<Handler, Handler> = new Map();

  // -------------------------------------------------------------------------
  // Public Static Methods
  // -------------------------------------------------------------------------

  /**
   * Gets a separate container instance for the given instance id.
   */
  static of(instanceId: any): ContainerInstance {
    if (instanceId === undefined) return this.globalInstance;

    let container = this.instances.get(instanceId);
    if (!container) {
      container = new ContainerInstance(instanceId);
      this.instances.set(instanceId, container);
    }

    return container;
  }

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
   * Checks if the service with given name or type is registered service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  static has<T>(identifier: ServiceIdentifier): boolean {
    return this.globalInstance.has(identifier as any);
  }

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
  static get<T>(service: { service: T }): T;

  /**
   * Retrieves the service with given name or type from the service container.
   * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
   */
  static get<T>(identifier: ServiceIdentifier<T>): T {
    return this.globalInstance.get(identifier as any);
  }

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
   * Gets all instances registered in the container of the given service identifier.
   * Used when service defined with multiple: true flag.
   */
  static getMany<T>(id: string | Token<T>): T[] {
    return this.globalInstance.getMany(id as any);
  }

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
   * Sets a value for the given type or service name in the container.
   */
  static set(
    identifierOrServiceMetadata:
      | ServiceIdentifier
      | ServiceMetadata<any, any>
      | (ServiceMetadata<any, any>[]),
    value?: any
  ): Container {
    this.globalInstance.set(identifierOrServiceMetadata as any, value);
    return this;
  }

  /**
   * Removes services with a given service identifiers (tokens or types).
   */
  static remove(...ids: ServiceIdentifier[]): Container {
    this.globalInstance.remove(...ids);
    return this;
  }

  /**
   * Completely resets the container by removing all previously registered services and handlers from it.
   */
  static reset(containerId?: any): Container {
    if (containerId) {
      const instance = this.instances.get(containerId);
      if (instance) {
        instance.reset();
        this.instances.delete(containerId);
      }
    } else {
      this.globalInstance.reset();
      Array.from(this.instances.values()).forEach(i => i.reset());
    }
    return this;
  }

  /**
   * Registers a new handler.
   */
  static registerHandler(handler: Handler): Container {
    this.handlers.set(handler, handler);
    return this;
  }

  /**
   * Helper method that imports given services.
   */
  static import(services: Function[]): Container {
    return this;
  }
}
