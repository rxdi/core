import { Service } from '../../container/decorators/Service';
import { BehaviorSubject } from 'rxjs';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class BootstrapsServices {

    private bootstraps: BehaviorSubject<Array<ServiceArgumentsInternal>> = new BehaviorSubject([]);

    register(plugin) {
        this.bootstraps.next([...this.bootstraps.getValue(), plugin]);
    }

    getBootstraps() {
        return this.bootstraps.getValue();
    }

}