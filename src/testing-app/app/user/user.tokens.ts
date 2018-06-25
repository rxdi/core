import { InjectionToken } from "../../../container/Token";

export interface CREATE_UNIQUE_HASH {
    testKey(key: string): string;
}


export const CREATE_UNIQUE_HASH = new InjectionToken<CREATE_UNIQUE_HASH>('create-unique-hash');
