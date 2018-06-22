import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { Module } from '../../decorators/module/module.decorator';

@Module({
    imports: [
        CoreModule,
        UserModule
    ]
})
export class AppModule {}
