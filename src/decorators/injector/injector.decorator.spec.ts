import { Injector } from './injector.decorator';
import { Container } from '../../container';

describe('Decorators: @GapiInjector', () => {
    it('Should inject value to property "valueExecutor" inside target ClassTestExecutor', (done) => {
        class ClassTestProvider {
            public valueProvider = 1;
        }
        class ClassTestExecutor {
            @Injector(ClassTestProvider) public valueExecutor: ClassTestProvider;
        }
        expect(Container.get(ClassTestExecutor).valueExecutor.valueProvider).toBe(1);
        done();
    });
});
