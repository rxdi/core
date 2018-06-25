"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
const ServiceNotFoundError_1 = require("./error/ServiceNotFoundError");
const MissingProvidedServiceTypeError_1 = require("./error/MissingProvidedServiceTypeError");
const Container_1 = require("./Container");
const constructor_watcher_1 = require("../services/constructor-watcher");
// import { controllerHooks } from '../services/controller-service/controller-hooks';
// import { effectHooks } from '../services/effect-hook/effect-hooks';
/**
 * TypeDI can have multiple containers.
 * One container is ContainerInstance.
 */
class ContainerInstance {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(id) {
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        /**
         * All registered services.
         */
        this.services = [];
        this.id = id;
    }
    /**
     * Checks if the service with given name or type is registered service container.
     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
     */
    has(identifier) {
        return !!this.findService(identifier);
    }
    /**
     * Retrieves the service with given name or type from the service container.
     * Optionally, parameters can be passed in case if instance is initialized in the container for the first time.
     */
    get(identifier) {
        const globalContainer = Container_1.Container.of(undefined);
        const service = globalContainer.findService(identifier);
        const scopedService = this.findService(identifier);
        if (service && service.global === true)
            return this.getServiceValue(identifier, service);
        if (scopedService)
            return this.getServiceValue(identifier, scopedService);
        if (service && this !== globalContainer) {
            const clonedService = Object.assign({}, service);
            clonedService.value = undefined;
            const value = this.getServiceValue(identifier, clonedService);
            this.set(identifier, value);
            return value;
        }
        return this.getServiceValue(identifier, service);
    }
    /**
     * Gets all instances registered in the container of the given service identifier.
     * Used when service defined with multiple: true flag.
     */
    getMany(id) {
        return this.filterServices(id).map(service => this.getServiceValue(id, service));
    }
    /**
     * Sets a value for the given type or service name in the container.
     */
    set(identifierOrServiceMetadata, value) {
        if (identifierOrServiceMetadata instanceof Array) {
            identifierOrServiceMetadata.forEach((v) => this.set(v));
            return this;
        }
        if (typeof identifierOrServiceMetadata === 'string' || identifierOrServiceMetadata instanceof Token_1.Token) {
            return this.set({ id: identifierOrServiceMetadata, value: value });
        }
        if (identifierOrServiceMetadata instanceof Function) {
            return this.set({ type: identifierOrServiceMetadata, id: identifierOrServiceMetadata, value: value });
        }
        // const newService: ServiceMetadata<any, any> = arguments.length === 1 && typeof identifierOrServiceMetadata === 'object'  && !(identifierOrServiceMetadata instanceof Token) ? identifierOrServiceMetadata : undefined;
        const newService = identifierOrServiceMetadata;
        const service = this.findService(newService.id);
        if (service && service.multiple !== true) {
            Object.assign(service, newService);
        }
        else {
            this.services.push(newService);
        }
        return this;
    }
    /**
     * Removes services with a given service identifiers (tokens or types).
     */
    remove(...ids) {
        ids.forEach(id => {
            this.filterServices(id).forEach(service => {
                this.services.splice(this.services.indexOf(service), 1);
            });
        });
        return this;
    }
    /**
     * Completely resets the container by removing all previously registered services from it.
     */
    reset() {
        this.services = [];
        return this;
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    /**
     * Filters registered service in the with a given service identifier.
     */
    filterServices(identifier) {
        return this.services.filter(service => {
            if (service.id)
                return service.id === identifier;
            if (service.type && identifier instanceof Function)
                return service.type === identifier || identifier.prototype instanceof service.type;
            return false;
        });
    }
    /**
     * Finds registered service in the with a given service identifier.
     */
    findService(identifier) {
        return this.services.find(service => {
            if (service.id)
                return service.id === identifier;
            if (service.type && identifier instanceof Function)
                return service.type === identifier; // || identifier.prototype instanceof service.type;
            return false;
        });
    }
    /**
     * Gets service value.
     */
    getServiceValue(identifier, service) {
        // find if instance of this object already initialized in the container and return it if it is
        if (service && service.value !== null && service.value !== undefined)
            return service.value;
        // if named service was requested and its instance was not found plus there is not type to know what to initialize,
        // this means service was not pre-registered and we throw an exception
        if ((!service || !service.type) &&
            (!service || !service.factory) &&
            (typeof identifier === 'string' || identifier instanceof Token_1.Token))
            throw new ServiceNotFoundError_1.ServiceNotFoundError(identifier);
        // at this point we either have type in service registered, either identifier is a target type
        let type = undefined;
        if (service && service.type) {
            type = service.type;
        }
        else if (service && service.id instanceof Function) {
            type = service.id;
        }
        else if (identifier instanceof Function) {
            type = identifier;
        }
        // if service was not found then create a new one and register it
        if (!service) {
            if (!type)
                throw new MissingProvidedServiceTypeError_1.MissingProvidedServiceTypeError(identifier);
            service = { type: type };
            this.services.push(service);
        }
        // setup constructor parameters for a newly initialized service
        const paramTypes = type && Reflect && Reflect.getMetadata ? Reflect.getMetadata('design:paramtypes', type) : undefined;
        let params = paramTypes ? this.initializeParams(type, paramTypes) : [];
        // if factory is set then use it to create service instance
        let value;
        if (service.factory) {
            // filter out non-service parameters from created service constructor
            // non-service parameters can be, lets say Car(name: string, isNew: boolean, engine: Engine)
            // where name and isNew are non-service parameters and engine is a service parameter
            params = params.filter(param => param !== undefined);
            if (service.factory instanceof Array) {
                // use special [Type, 'create'] syntax to allow factory services
                // in this case Type instance will be obtained from Container and its method 'create' will be called
                value = this.get(service.factory[0])[service.factory[1]](...params);
            }
            else {
                value = service.factory(...params);
            }
        }
        else {
            if (!type)
                throw new MissingProvidedServiceTypeError_1.MissingProvidedServiceTypeError(identifier);
            params.unshift(null);
            // 'extra feature' - always pass container instance as the last argument to the service function
            // this allows us to support javascript where we don't have decorators and emitted metadata about dependencies
            // need to be injected, and user can use provided container to get instances he needs
            params.push(this);
            if (type.prototype.OnBefore) {
                type.prototype.OnBefore.bind(type)();
            }
            value = new (type.bind.apply(type, params))();
            if (value.OnInit) {
                value.OnInit.bind(value)();
            }
            constructor_watcher_1.constructorWatcherService.createConstructor(type['name'], { type, value });
        }
        if (service && !service.transient && value)
            service.value = value;
        if (type)
            this.applyPropertyHandlers(type, value);
        return value;
    }
    /**
     * Initializes all parameter types for a given target service class.
     */
    initializeParams(type, paramTypes) {
        return paramTypes.map((paramType, index) => {
            const paramHandler = Container_1.Container.handlers.find(handler => handler.object === type && handler.index === index);
            if (paramHandler)
                return paramHandler.value(this);
            if (paramType && paramType.name && !this.isTypePrimitive(paramType.name)) {
                return this.get(paramType);
            }
            return undefined;
        });
    }
    /**
     * Checks if given type is primitive (e.g. string, boolean, number, object).
     */
    isTypePrimitive(param) {
        return ['string', 'boolean', 'number', 'object'].indexOf(param.toLowerCase()) !== -1;
    }
    /**
     * Applies all registered handlers on a given target class.
     */
    applyPropertyHandlers(target, instance) {
        Container_1.Container.handlers.forEach(handler => {
            if (typeof handler.index === 'number')
                return;
            if (handler.object.constructor !== target && !(target.prototype instanceof handler.object.constructor))
                return;
            instance[handler.propertyName] = handler.value(this);
        });
    }
}
exports.ContainerInstance = ContainerInstance;
