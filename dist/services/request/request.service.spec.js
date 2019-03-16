"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("../../container/Container");
const request_service_1 = require("./request.service");
const operators_1 = require("rxjs/operators");
require("jest");
const requestService = Container_1.Container.get(request_service_1.RequestService);
const testLink = 'https://ipfs.infura.io/ipfs/QmPhYdx4dB6TwBU1KEbYmyET7HQJoLpyERvRD4kMWv3B3a';
describe('Service: ConstructorWatcher', () => {
    it('Should create appropriate class with this applied to constructor', (done) => {
        requestService.get(testLink)
            .pipe(operators_1.map((res) => expect(res).toBe('Hello world from @gapi/ipfs module')), operators_1.tap(() => done())).subscribe();
    });
});
