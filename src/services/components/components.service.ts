import { Service } from '../../decorators/service/Service';
import { BehaviorSubject } from 'rxjs';
import { ServiceArgumentsInternal } from '../../decorators/module/module.interfaces';

@Service()
export class ComponentsService {
  private components: BehaviorSubject<
    Array<ServiceArgumentsInternal>
  > = new BehaviorSubject([]);

  register(plugin) {
    this.components.next([...this.components.getValue(), plugin]);
  }

  getComponents() {
    return this.components.getValue();
  }
}
