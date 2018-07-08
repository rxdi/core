import { constructorWatcherService } from './constructor-watcher';
import { Container } from '../../container/Container';
import { Controller } from '../../decorators/controller/controller.decorator';
import { Service } from '../../container/decorators/Service';


@Service()
export class TestService {
    id = 2;
}

@Controller()
class TestConstructor {
    id = 1;

    constructor(
        private testService: TestService
    ) {}
}

describe('Service: ConstructorWatcher', () => {
    it('Should create appropriate class with this applied to constructor', (done) => {
        Container.get(TestService);
        Container.get(TestConstructor);
        const testConstructorThis = constructorWatcherService.getByClass(TestConstructor);
        const testServiceThis = constructorWatcherService.getByClass(TestService);
        expect(testConstructorThis['id']).toBe(1);
        expect(testServiceThis['id']).toBe(2);
        done();
    });
});
