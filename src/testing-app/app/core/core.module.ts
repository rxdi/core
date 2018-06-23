import { Module } from "../../../decorators/module/module.decorator";
import { TestHapiPlugin } from "../user/user.module";

@Module({
    imports: [
    ],
    plugins: [TestHapiPlugin]
})
export class CoreModule {}