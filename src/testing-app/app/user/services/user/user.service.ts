import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Inject } from "../../../../../container/decorators/Inject";
import { Service } from "../../../../../container/decorators/Service";
import { CompressionService } from "../../../../../services";
import { FileService } from "../../../../../services/file";
import { CREATE_UNIQUE_HASH } from "../../user.tokens";
import { Controller } from "../../../../../decorators/controller/controller.decorator";

@Controller()
export class UserService {
    constructor(
        @Inject(CREATE_UNIQUE_HASH) private ipfsDownloadedFactory: { testKey: () => string },
        @Inject('testFactoryAsync') private testFactoryAsync: { testKey: () => string },
        @Inject('testChainableFactoryFunction') private chainableFactory: Observable<number>,
        private compression: CompressionService,
        private fileService: FileService

    ) {
        // this.fileService.fileWalker('./src')
        //     .subscribe(files => {
        //         console.log(files.filter(r => !!r.includes('.ts') && !r.includes('testing-app')));
        //     });

        console.log('UserService', this.ipfsDownloadedFactory.testKey(), this.testFactoryAsync);
        // this.chainableFactory
        //     .pipe(
        //         map((res) => res)
        //     )
        //     .subscribe(value => console.log('Value chaining factory ', value));

    }

    testService(key) {
        console.log(key);
        return key;
    }
}