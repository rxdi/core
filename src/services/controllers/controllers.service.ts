import { Service } from "../../container/decorators/Service";
import { BehaviorSubject } from 'rxjs';

@Service()
export class ControllersService {

    private controllers: BehaviorSubject<Array<Function>> = new BehaviorSubject([]);

    register(plugin) {
        this.controllers.next([...this.controllers.getValue(), plugin]);
    }

    getControllers() {
        return this.controllers.getValue();
    }

}