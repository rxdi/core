import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';
export declare class EffectsService {
    private effects;
    register(plugin: any): void;
    getEffects(): ServiceArgumentsInternal[];
}
