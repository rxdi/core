import { Service } from "../../container/decorators/Service";
import { BehaviorSubject } from 'rxjs';

@Service()
export class EffectsService {

    private effects: BehaviorSubject<Array<Function>> = new BehaviorSubject([]);

    register(plugin) {
        this.effects.next([...this.effects.getValue(), plugin]);
    }

    getEffects() {
        return this.effects.getValue();
    }

}