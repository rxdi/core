import { InjectionToken } from "../../../container/Token";
export interface CREATE_UNIQUE_HASH {
    testKey(key: string): string;
}
export declare const CREATE_UNIQUE_HASH: InjectionToken<CREATE_UNIQUE_HASH>;
