import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
    @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El apellido solo puede contener letras' })
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El username no puede exceder 30 caracteres' })
    @Matches(/^\S+$/, { message: 'El username no puede contener espacios' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(32, { message: 'La contraseña no puede exceder 32 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'La contraseña debe tener mayúscula, minúscula, número y carácter especial (@$!%*?&)'
    })
    password: string;

    @IsOptional()
    @IsString()
    role: string;
}