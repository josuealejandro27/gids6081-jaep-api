import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/common/services/prisma.service";
import { UtilService } from "src/common/services/util.service";
import { LogService } from "src/common/services/log.service";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, UtilService, LogService],
})
export class AuthModule {}