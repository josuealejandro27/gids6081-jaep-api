import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "../dto/create-task.dto";
import { updateTaskDto } from "../dto/update-task.dto";
import { AuthGuard } from "src/common/guards/auth.guard";

@Controller("api/task")
@UseGuards(AuthGuard) // todas las rutas de task requieren autenticación
export class TaskController {

    constructor(private taskSvc: TaskService) {}

    @Get()
    async getAllTask(@Req() req: any) {
        return await this.taskSvc.getAllTask(req['user'].id);
    }

    @Get(":id")
    public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        return await this.taskSvc.getTaskById(id, req['user'].id);
    }

    @Post()
    public async insertTask(@Body() task: CreateTaskDto, @Req() req: any) {
        // Ignorar el user_id que venga del body, usar siempre el del token
        return await this.taskSvc.insertTask(task, req['user'].id);
    }

    @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: updateTaskDto, @Req() req: any) {
        return await this.taskSvc.updateTask(id, task, req['user'].id);
    }

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        await this.taskSvc.deleteTask(id, req['user'].id);
        return true;
    }
}