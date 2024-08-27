import { Global, Module, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Global()
@Module({
    providers: [
        {
            provide : APP_PIPE,
            useClass : ValidationPipe,
        },
    ],
    exports :  [APP_PIPE],
})
export class GlobalModule {}