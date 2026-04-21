import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { mysqlProvider } from "src/common/providers/mysql.provider";
import { PrismaService } from "src/common/services/prisma.service";
import { LogService } from "src/common/services/log.service";
import { UtilService } from "src/common/services/util.service";

@Module({
    controllers: [TaskController],
    providers: [TaskService, mysqlProvider, PrismaService, LogService, UtilService]
})
export class TaskModule {}