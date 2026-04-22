import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../dto/login.dto";
import { UtilService } from "src/common/services/util.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { TokenBlacklistService } from "src/common/services/token-blacklist.service";
import type { Request } from "express";

@Controller("api/auth")
export class AuthController {

    constructor(
        private readonly authSvc: AuthService,
        private readonly utilSvc: UtilService,
        private readonly blacklistSvc: TokenBlacklistService
    ) {}

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginDto: LoginDto, @Req() req: Request): Promise<any> {
        const { username, password } = loginDto;

        const user = await this.authSvc.getUserByUsername(username);

        if (!user) {
            await this.authSvc.logFailedLogin(username, req.url);
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');
        }

        if (await this.utilSvc.checkPassword(password, user.password)) {
            const { password: _p, ...payload } = user;

            const access_token = await this.utilSvc.generateJWT(payload, '1h');
            const refresh_token = await this.utilSvc.generateJWT(payload, '7d');

            await this.authSvc.logSuccessLogin(user.id, req.url);

            return { access_token, refresh_token };

        } else {
            await this.authSvc.logFailedLogin(username, req.url);
            throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
        }
    }

    @Get("/me")
    @UseGuards(AuthGuard)
    public getProfile(@Req() request: any) {
        return request['user'];
    }

    @Post("/refresh")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    public async refreshToken(@Req() request: any) {
        const sessionUser = request['user'];
        const user = await this.authSvc.getUserById(sessionUser.id);

        if (!user) throw new UnauthorizedException('Usuario no encontrado');

        const { password: _p, ...payload } = user;
        const access_token = await this.utilSvc.generateJWT(payload, '1h');
        const refresh_token = await this.utilSvc.generateJWT(payload, '7d');

        return { access_token, refresh_token };
    }

    @Post("/logout")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    public async logout(@Req() request: any) {
        const token = request['token'];
        this.blacklistSvc.add(token);
        await this.authSvc.logLogout(request['user'].id, '/api/auth/logout');
    }
}