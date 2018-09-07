import { Container } from '../../container/Container';
import { MetadataService } from './metadata.service';
import { Service } from '../../container';
import { Module } from '../../decorators/module/module.decorator';

class Pesho {

}

@Service()
class PeshoService {

}

@Module({
    services: [PeshoService]
})
class PeshoModule { }

const metadataService = Container.get(MetadataService);
describe('Service: Metadata', () => {
    it('Should create appropriate metadata based on imports inside module and hash should equal 32 signs', (done) => {
        const modules = {
            imports: [PeshoModule],
            services: [PeshoService]
        };
        const generatedHashData = metadataService.generateHashData(modules, Pesho);
        const uniqueModuleTemplate = metadataService.parseModuleTemplate('Pesho', generatedHashData, `${Pesho}`);
        const uniqueHashForClass = metadataService.createUniqueHash(uniqueModuleTemplate);
        expect(generatedHashData[0][0]['hash']).toBe(PeshoService['metadata']['moduleHash']);
        expect(generatedHashData[0][0]['moduleName']).toBe(PeshoService['metadata']['moduleName']);
        expect(generatedHashData[1][0]['hash']).toBe(PeshoModule['metadata']['moduleHash']);
        expect(generatedHashData[1][0]['moduleName']).toBe(PeshoModule['metadata']['moduleName']);
        expect(uniqueHashForClass).toBeTruthy();
        expect(uniqueHashForClass.length).toBe(64);
        done();
    });
});
