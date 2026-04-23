import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El username no puede exceder 30 caracteres' })
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(32, { message: 'La contraseña no puede exceder 32 caracteres' })
    password: string;
}