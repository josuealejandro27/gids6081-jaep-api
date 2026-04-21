import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { updateTaskDto } from "../dto/update-task.dto";
import { PrismaService } from "src/common/services/prisma.service";
import { LogService } from "src/common/services/log.service";

@Injectable()
export class TaskService {

    constructor(
        @Inject('MYSQL_CONNECTION') private mysql: any,
        private prisma: PrismaService,
        private logSvc: LogService
    ) {}

    // Solo las tareas del usuario en sesión
    public async getAllTask(userId: number): Promise<Task[]> {
        return await this.prisma.task.findMany({
            where: { user_id: userId },
            orderBy: [{ name: "asc" }]
        });
    }

    public async getTaskById(id: number, userId: number): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');
        if (task.user_id !== userId) throw new ForbiddenException('No tienes acceso a esta tarea');
        return task;
    }

    public async insertTask(task: CreateTaskDto, userId: number): Promise<Task> {
        const newTask = await this.prisma.task.create({
            data: { ...task, user_id: userId }
        });

        await this.logSvc.write({
            statusCode: 201,
            path: '/api/task',
            error: `Tarea creada: ${newTask.name}`,
            errorCode: 'TASK_CREATED',
            session_id: userId
        });

        return newTask;
    }

    public async updateTask(id: number, taskUpdated: updateTaskDto, userId: number): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');
        if (task.user_id !== userId) throw new ForbiddenException('No puedes editar esta tarea');

        return await this.prisma.task.update({
            where: { id },
            data: taskUpdated
        });
    }

    public async deleteTask(id: number, userId: number): Promise<Task> {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) throw new NotFoundException('Tarea no encontrada');
        if (task.user_id !== userId) throw new ForbiddenException('No puedes eliminar esta tarea');

        const deleted = await this.prisma.task.delete({ where: { id } });

        await this.logSvc.write({
            statusCode: 200,
            path: `/api/task/${id}`,
            error: `Tarea eliminada: ${deleted.name}`,
            errorCode: 'TASK_DELETED',
            session_id: userId
        });

        return deleted;
    }
}