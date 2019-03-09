import { Service } from '../../container/decorators/Service';
import { BehaviorSubject } from 'rxjs';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class EffectsService {

    private effects: BehaviorSubject<Array<ServiceArgumentsInternal>> = new BehaviorSubject([]);

    register(plugin) {
        this.effects.next([...this.effects.getValue(), plugin]);
    }

    getEffects() {
        return this.effects.getValue();
    }

}