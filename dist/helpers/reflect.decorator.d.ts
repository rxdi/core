import { Metadata } from '../decorators';
export declare function ReflectDecorator<T, K extends keyof T>(options: any, metaOptions: Metadata): (target: Function) => void;
