import { Global, Module } from "@nestjs/common";
import { UtilService } from "./services/util.service";
import { TokenBlacklistService } from "./services/token-blacklist.service";

@Global()
@Module({
    providers: [UtilService, TokenBlacklistService],
    exports: [UtilService, TokenBlacklistService]
})
export class CommonModule {}