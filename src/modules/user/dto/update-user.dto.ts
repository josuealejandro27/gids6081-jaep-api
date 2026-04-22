import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
    lastname?: string;

    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
    @MaxLength(50, { message: 'El username no puede exceder 50 caracteres' })
    username?: string;

    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(32, { message: 'La contraseña no puede exceder 32 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'La contraseña debe tener mayúscula, minúscula, número y carácter especial'
    })
    password?: string;
}