import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/tasks/interfaces/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/interfaces/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LogsModule } from './modules/logs/interfaces/logs.module';
import { CommonModule } from './common/common.module';

@Module({
    imports: [
        CommonModule,
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
    providers: [],
})
export class AppModule {}