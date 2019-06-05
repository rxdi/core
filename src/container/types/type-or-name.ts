import { Token } from '../Token';

export type TypeOrName = ((type?: any) => Function) | string | Token<any>;
