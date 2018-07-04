import { Service } from '../../container/decorators/Service';
import { BehaviorSubject } from 'rxjs';

@Service()
export class ServicesService {

    private services: BehaviorSubject<Array<Function>> = new BehaviorSubject([]);

    register(plugin) {
        this.services.next([...this.services.getValue(), plugin]);
    }

    getServices() {
        return this.services.getValue();
    }

}