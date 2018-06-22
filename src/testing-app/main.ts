import { Bootstrap } from "../helpers/bootstrap";
import { AppModule } from "./app/app.module";

Bootstrap(AppModule, {
    init: true,
    logger: {
        logging: true,
        date: true,
        hashes: true,
        exitHandler: true,
        fileService: true
    }
})
.subscribe(
    () => console.log('Started!'),
    (e) => console.error(e)
);