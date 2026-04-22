import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'La descripción es requerida' })
    @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    @MaxLength(250, { message: 'La descripción no puede exceder 250 caracteres' })
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    priority: boolean;

    user_id: number;
}