import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class CreateTaskDto {

    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y números' })
    name: string;

    @IsString({ message: 'La descripción debe ser un texto' })
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
    @MaxLength(250, { message: 'La descripción no puede exceder 250 caracteres' })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'La descripción solo puede contener letras y números' })
    description: string;

    @IsNotEmpty({ message: 'La prioridad es requerida' })
    @IsBoolean({ message: 'La prioridad debe ser un valor booleano' })
    priority: boolean;

    user_id: number;
}