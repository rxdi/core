import { constructorWatcherService } from './constructor-watcher';
import { Container } from '../../container/Container';
import { Controller } from '../../decorators/controller/controller.decorator';
import { Service } from '../../container/decorators/Service';
import { OnInit } from '../../container';


@Service()
export class TestService {
    id = 2;
}

@Controller()
class TestConstructor implements OnInit {
    id = 1;

    constructor(
        private testService: TestService
    ) { }

    OnInit() {
        this.test();
    }

    test() {
        return 1;
    }

}

describe('Service: ConstructorWatcher', () => {

    it('Should create appropriate class with this applied to constructor', (done) => {
        Container.get(TestConstructor);
        Container.get(TestService);
        const testConstructorThis = constructorWatcherService.getByClass<TestConstructor>(TestConstructor);
        const testServiceThis = constructorWatcherService.getByClass<TestService>(TestService);
        expect(testConstructorThis.id).toBe(1);
        expect(testServiceThis.id).toBe(2);
        done();
    });

    it('Should trigger OnInit on current test Class ', (done) => {
        const testConstructor = Container.get(TestConstructor);
        const testSpy = spyOn(testConstructor, 'OnInit');
        Container.get(TestService);
        constructorWatcherService.triggerOnInit(TestConstructor);
        expect(testSpy).toHaveBeenCalled();
        done();
    });

});
