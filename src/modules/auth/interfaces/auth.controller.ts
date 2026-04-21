import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../dto/login.dto";
import { UtilService } from "src/common/services/util.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { AppException } from "src/common/exceptions/app.exception";
import type { Request } from "express";

@Controller("api/auth")
export class AuthController {

    constructor(
        private readonly authSvc: AuthService,
        private readonly utilSvc: UtilService
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<any> {
        const { username, password } = loginDto;
        const path = req.url;

        const user = await this.authSvc.getUserByUsername(username);

        if (!user) {
            await this.authSvc.logFailedLogin(username, path);
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }

        if (await this.utilSvc.checkPassword(password, user.password!)) {
            const { password: _p, username: _u, ...payload } = user;

            const access_token = await this.utilSvc.generateJWT(payload, '1h');
            const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
            const hashRT = await this.utilSvc.hash(refresh_token);

            await this.authSvc.updateHash(user.id, hashRT);
            await this.authSvc.logSuccessLogin(user.id, path);

            return { access_token, refresh_token };

        } else {
            await this.authSvc.logFailedLogin(username, path);
            throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
        }
    }

    @Get("/me")
    @UseGuards(AuthGuard)
    public getProfile(@Req() request: any) {
        return request['user'];
    }

    @Post("/refresh")
    @UseGuards(AuthGuard)
    public async refreshToken(@Req() request: any) {
        const sessionUser = request['user'];
        const user = await this.authSvc.getUserById(sessionUser.id);

        if (!user || !user.hash)
            throw new AppException('Token invalido', HttpStatus.FORBIDDEN, '2');

        if (sessionUser.hash != user.hash)
            throw new ForbiddenException('Token invalido');

        const { password: _p, username: _u, ...payload } = user as any;
        const access_token = await this.utilSvc.generateJWT(payload, '1h');
        const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
        const hashRT = await this.utilSvc.hash(refresh_token);
        await this.authSvc.updateHash(user.id, hashRT);

        return { access_token, refresh_token };
    }

    @Post("/logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    public async logout(@Req() request: any) {
        const session = request['user'];
        await this.authSvc.logLogout(session.id, '/api/auth/logout');
        return await this.authSvc.updateHash(session.id, null);
    }
}