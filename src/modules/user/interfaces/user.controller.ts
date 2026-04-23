import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { UtilService } from "src/common/services/util.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("api/user")
export class UserController {

    constructor(
        private userSvc: UserService,
        private readonly utilSvc: UtilService
    ) {}

    // Solo admin puede ver todos los usuarios
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    async getAllUser(): Promise<Partial<User>[]> {
        return await this.userSvc.getAllUser();
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    public async getUserById(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<Partial<User> | null> {
        const sessionUser = req['user'];
        // Un usuario solo puede ver su propio perfil, admin puede ver cualquiera
        if (sessionUser.role !== 'admin' && sessionUser.id !== id)
            throw new ForbiddenException('No puedes ver el perfil de otro usuario');

        return await this.userSvc.getUserById(id);
    }

    // Registro público — sin autenticación, solo crea usuarios con rol 'user'
    @Post('/register')
    public async registerPublic(@Body() user: CreateUserDto): Promise<Partial<User>> {
        // Forzar rol 'user' siempre, sin importar lo que venga en el body
        user.role = 'user';
        const encryptedPassword = await this.utilSvc.hash(user.password);
        user.password = encryptedPassword;
        return await this.userSvc.insertUser(user);
    }

    // Solo admin puede registrar nuevos usuarios
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    public async insertUser(@Body() user: CreateUserDto, @Req() req: any): Promise<Partial<User>> {
        const sessionUser = req['user'];
        if (user['role'] === 'admin' && sessionUser.role !== 'admin')
            throw new ForbiddenException('Solo un admin puede crear otro admin');

        const encryptedPassword = await this.utilSvc.hash(user.password);
        user.password = encryptedPassword;
        return await this.userSvc.insertUser(user);
    }

    // Un usuario solo puede editar su propio perfil (prevención de IDOR)
    @Put(":id")
    @UseGuards(AuthGuard)
    public async updateUser(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateUserDto, @Req() req: any): Promise<Partial<User>> {
        const sessionUser = req['user'];
        if (sessionUser.role !== 'admin' && sessionUser.id !== id)
            throw new ForbiddenException('No puedes editar el perfil de otro usuario');

        return await this.userSvc.updateUser(id, body);
    }

    // Solo admin puede eliminar usuarios
    @Delete(":id")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
        await this.userSvc.deleteUser(id);
        return true;
    }
}