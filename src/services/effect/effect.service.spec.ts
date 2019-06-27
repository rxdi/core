import { EffectsService } from './effect.service';
import { Container } from '../../container/Container';
import { Effect } from '../../decorators/effect/effect.decorator';
import 'jest';

const effectService = Container.get(EffectsService);

@Effect()
class TestEffect {}

describe('Service: EffectsService', () => {
  it('Should register appropriate effect inside effects observable', done => {
    effectService.register(TestEffect);
    expect(effectService.getEffects().length).toBe(1);
    done();
  });
});
