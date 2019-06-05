"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContainerInstance_1 = require("./ContainerInstance");
/**
 * Service container.
 */
class Container {
    // -------------------------------------------------------------------------
    // Public Static Methods
    // -------------------------------------------------------------------------
    /**
     * Gets a separate container instance for the given instance id.
     */
    static of(instanceId) {
        if (instanceId === undefined)
            return this.globalInstance;
        let container = this.instances.get(instanceId);
        if (!container) {
            container = new ContainerInstance_1.ContainerInstance(instanceId);
            this.instances.set(instanceId, container);
        }
        return container;
    }
    /**
     * Checks if the service with given name or type is registered service container.
     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
     */
    static has(identifier) {
        return this.globalInstance.has(identifier);
    }
    /**
     * Retrieves the service with given name or type from the service container.
     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
     */
    static get(identifier) {
        return this.globalInstance.get(identifier);
    }
    /**
     * Gets all instances registered in the container of the given service identifier.
     * Used when service defined with multiple: true flag.
     */
    static getMany(id) {
        return this.globalInstance.getMany(id);
    }
    /**
     * Sets a value for the given type or service name in the container.
     */
    static set(identifierOrServiceMetadata, value) {
        this.globalInstance.set(identifierOrServiceMetadata, value);
        return this;
    }
    /**
     * Removes services with a given service identifiers (tokens or types).
     */
    static remove(...ids) {
        this.globalInstance.remove(...ids);
        return this;
    }
    /**
     * Completely resets the container by removing all previously registered services and handlers from it.
     */
    static reset(containerId) {
        if (containerId) {
            const instance = this.instances.get(containerId);
            if (instance) {
                instance.reset();
                this.instances.delete(containerId);
            }
        }
        else {
            this.globalInstance.reset();
            Array.from(this.instances.values()).forEach(i => i.reset());
        }
        return this;
    }
    /**
     * Registers a new handler.
     */
    static registerHandler(handler) {
        this.handlers.push(handler);
        return this;
    }
    /**
     * Helper method that imports given services.
     */
    static import(services) {
        return this;
    }
}
// -------------------------------------------------------------------------
// Private Static Properties
// -------------------------------------------------------------------------
/**
 * Global container instance.
 */
Container.globalInstance = new ContainerInstance_1.ContainerInstance(undefined);
/**
 * Other containers created using Container.of method.
 */
Container.instances = new Map();
/**
 * All registered handlers.
 */
Container.handlers = [];
exports.Container = Container;
