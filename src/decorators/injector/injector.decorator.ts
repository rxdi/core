import { Container } from "../../container";

export function Injector<T, K extends keyof T>(Service: T): Function {
    return function (target: Function, propertyName: string, index?: number) {
        const service: T = Container.get<T>(Service);
        target[propertyName] = service;
    };
}


