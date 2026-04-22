import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/common/services/prisma.service";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class UserService {

    constructor(
        @Inject('MYSQL_CONNECTION') private mysql: any,
        private prisma: PrismaService
    ) {}

    public async getAllUser(): Promise<Partial<User>[]> {
        return await this.prisma.user.findMany({
            orderBy: [{ name: "asc" }],
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true,
                password: false
            }
        });
    }

    public async getUserById(id: number): Promise<Partial<User> | null> {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true,
                password: false
            }
        });
    }

    public async updateUser(id: number, userUpdated: UpdateUserDto): Promise<Partial<User>> {
        const updated = await this.prisma.user.update({
            where: { id },
            data: userUpdated
        });
        const { password, ...safeUser } = updated;
        return safeUser;
    }

    public async insertUser(user: CreateUserDto): Promise<Partial<User>> {
        const created = await this.prisma.user.create({ data: user });
        const { password, ...safeUser } = created;
        return safeUser;
    }

    public async deleteUser(id: number): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { task: true }
        });

        if (!user) throw new BadRequestException('Usuario no encontrado');

        if (user.task && user.task.length > 0)
            throw new BadRequestException('No se puede eliminar el usuario porque tiene tareas asignadas');

        await this.prisma.user.delete({ where: { id } });
    }
}