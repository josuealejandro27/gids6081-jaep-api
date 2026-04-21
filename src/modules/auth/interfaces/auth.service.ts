import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { User } from "src/modules/user/entities/user.entity";
import { LogService } from "src/common/services/log.service";

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly logSvc: LogService
    ) {}

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { id }
        });
    }

    public async updateHash(user_id: number, hash: string | null): Promise<User> {
        return await this.prisma.user.update({
            where: { id: user_id },
            data: { hash }
        });
    }

    // Log de login fallido
    public async logFailedLogin(username: string, path: string) {
        await this.logSvc.write({
            statusCode: 401,
            path,
            error: `Login fallido para usuario: ${username}`,
            errorCode: 'LOGIN_FAILED',
            session_id: null
        });
    }

    // Log de login exitoso
    public async logSuccessLogin(userId: number, path: string) {
        await this.logSvc.write({
            statusCode: 200,
            path,
            error: 'Login exitoso',
            errorCode: 'LOGIN_SUCCESS',
            session_id: userId
        });
    }

    // Log de logout
    public async logLogout(userId: number, path: string) {
        await this.logSvc.write({
            statusCode: 200,
            path,
            error: 'Logout',
            errorCode: 'LOGOUT',
            session_id: userId
        });
    }
}