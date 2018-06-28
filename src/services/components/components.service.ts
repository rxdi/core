import { Service } from "../../container/decorators/Service";
import { BehaviorSubject } from 'rxjs';

@Service()
export class ComponentsService {

    private components: BehaviorSubject<Array<Function>> = new BehaviorSubject([]);

    register(plugin) {
        this.components.next([...this.components.getValue(), plugin]);
    }

    getComponents() {
        return this.components.getValue();
    }

}