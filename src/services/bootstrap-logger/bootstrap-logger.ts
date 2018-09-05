import { Service } from '../../container';
import { ConfigService } from '../config/index';
import { Injector } from '../../decorators/injector/injector.decorator';

@Service()
export class BootstrapLogger {

    @Injector(ConfigService) configService: ConfigService;

    log(message: string) {
        if (this.configService.config.logger.logging) {
            const m = [this.logDate(), message];
            console.log(...m);
            return m;
        }
    }

    error(message: string) {
        console.error(message);
    }

    logImporter(message: string) {
        if (this.configService.config.logger.logging) {
            return this.log(message);
        }
    }

    logDate() {
        if (this.configService.config.logger.date) {
            return `${Date.now().toPrecision()}`;
        } else {
            return '';
        }
    }

    logFileService(message: string) {
        if (this.configService.config.logger.fileService) {
            this.log(message);
            return '``';
        }
    }

    logHashes(message: string) {
        if (this.configService.config.logger.hashes) {
            return message;
        } else {
            return '';
        }
    }

    logExitHandler(message: string) {
        if (this.configService.config.logger.exitHandler) {
            this.log(message);
        } else {
            return '';
        }
    }
}