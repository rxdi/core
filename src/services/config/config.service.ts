import { Service } from '../../container';
import { ConfigModel } from './config.model';

@Service()
export class ConfigService {
    config: ConfigModel = new ConfigModel();
    setConfig(config) {
        Object.assign(this.config, config);
    }
}