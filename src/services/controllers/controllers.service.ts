import { Service } from '../../decorators/service/Service';
import { BehaviorSubject } from 'rxjs';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class ControllersService {
  private controllers: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);

  register(plugin) {
    this.controllers.next([...this.controllers.getValue(), plugin]);
  }

  getControllers() {
    return this.controllers.getValue();
  }
}
