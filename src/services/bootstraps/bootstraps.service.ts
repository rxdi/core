import { Service } from '../../container/decorators/Service';
import { BehaviorSubject } from 'rxjs';

@Service()
export class BootstrapsServices {

    private bootstraps: BehaviorSubject<Array<Function>> = new BehaviorSubject([]);

    register(plugin) {
        this.bootstraps.next([...this.bootstraps.getValue(), plugin]);
    }

    getBootstraps() {
        return this.bootstraps.getValue();
    }

}