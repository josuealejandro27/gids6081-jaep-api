import { IsBoolean, IsOptional, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class updateTaskDto {

    @IsOptional()
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'No puede exceder 100 caracteres' })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y números' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
    @MaxLength(250, { message: 'No puede exceder 250 caracteres' })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'La descripción solo puede contener letras y números' })
    description?: string;

    @IsOptional()
    @IsBoolean()
    priority?: boolean;
}