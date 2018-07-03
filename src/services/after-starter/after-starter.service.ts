import { Service } from "container";
import { Subject } from "rxjs";

@Service()
export class AfterStarterService {
    appStarted: Subject<boolean> = new Subject();
}