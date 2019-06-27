import { Service } from '../../decorators/service/Service';
import { Subject } from 'rxjs';

@Service()
export class AfterStarterService {
  appStarted: Subject<boolean> = new Subject();
}
