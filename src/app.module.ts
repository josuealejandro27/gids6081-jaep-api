import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/tasks/interfaces/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/interfaces/user.module';
import { UtilService } from './common/services/util.service';
import { JwtModule } from '@nestjs/jwt';
import { LogsModule } from './modules/logs/interfaces/logs.module';

@Module({
    imports: [
        AuthModule,
        TaskModule,
        UserModule,
        LogsModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' },
            }),
        })
    ],
    controllers: [],
    providers: [UtilService],
})
export class AppModule {}