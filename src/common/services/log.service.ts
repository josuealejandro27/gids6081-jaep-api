import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class LogService {

    constructor(private readonly prisma: PrismaService) {}

    async write(data: {
        statusCode: number;
        path: string;
        error: string;
        errorCode: string;
        session_id?: number | null;
    }) {
        return await this.prisma.logs.create({
            data: {
                statusCode: data.statusCode,
                timestamp: new Date(),
                path: data.path,
                error: data.error,
                errorCode: data.errorCode,
                session_id: data.session_id ?? null
            }
        });
    }
}