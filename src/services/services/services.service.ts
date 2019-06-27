import { Service } from '../../decorators/service/Service';
import { BehaviorSubject } from 'rxjs';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class ServicesService {
  private services: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);

  register(plugin) {
    this.services.next([...this.services.getValue(), plugin]);
  }

  getServices() {
    return this.services.getValue();
  }
}
