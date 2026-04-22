import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { UtilService } from "../services/util.service";
import { TokenBlacklistService } from "../services/token-blacklist.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly utilSvc: UtilService,
        private readonly blacklistSvc: TokenBlacklistService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const token = this.extractTokenFromHeader(request);

        if (!token) throw new UnauthorizedException();

        if (this.blacklistSvc.isBlacklisted(token))
            throw new UnauthorizedException('Token revocado, inicia sesión nuevamente');

        try {
            const payload = await this.utilSvc.getPayload(token);
            request['user'] = payload;
            request['token'] = token;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }
}