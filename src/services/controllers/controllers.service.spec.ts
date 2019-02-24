import { ControllersService } from './controllers.service';
import { Container } from '../../container/Container';
import { Controller } from '../../decorators/controller/controller.decorator';
import 'jest';

const controllersService = Container.get(ControllersService);

@Controller()
class TestEffect {}

describe('Service: ControllersService', () => {
    it('Should register appropriate controller', (done) => {
        controllersService.register(TestEffect);
        expect(controllersService.getControllers().length).toBe(1);
        done();
    });
});
