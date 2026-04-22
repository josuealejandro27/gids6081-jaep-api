import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { LogService } from "src/common/services/log.service";

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly logSvc: LogService
    ) {}

    public async getUserByUsername(username: string): Promise<any> {
        return await this.prisma.user.findFirst({ where: { username } });
    }

    public async getUserById(id: number): Promise<any> {
        return await this.prisma.user.findFirst({ where: { id } });
    }

    public async logFailedLogin(username: string, path: string) {
        await this.logSvc.write({
            statusCode: 401,
            path,
            error: `Login fallido para usuario: ${username}`,
            errorCode: 'LOGIN_FAILED',
            session_id: null
        });
    }

    public async logSuccessLogin(userId: number, path: string) {
        await this.logSvc.write({
            statusCode: 200,
            path,
            error: 'Login exitoso',
            errorCode: 'LOGIN_SUCCESS',
            session_id: userId
        });
    }

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