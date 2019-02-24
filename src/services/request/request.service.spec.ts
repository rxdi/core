import { Container } from '../../container/Container';
import { RequestService } from './request.service';
import { tap, map } from 'rxjs/operators';
import 'jest';

const requestService = Container.get(RequestService);
const testLink = 'https://ipfs.infura.io/ipfs/QmPhYdx4dB6TwBU1KEbYmyET7HQJoLpyERvRD4kMWv3B3a';
describe('Service: ConstructorWatcher', () => {
    it('Should create appropriate class with this applied to constructor', (done) => {
        requestService.get(testLink)
            .pipe(
                map((res) => expect(res).toBe('Hello world from @gapi/ipfs module')),
                tap(() => done())
            ).subscribe();
    });
});
