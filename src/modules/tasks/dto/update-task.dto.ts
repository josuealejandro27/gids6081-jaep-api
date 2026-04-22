import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class updateTaskDto {

    @IsOptional()
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'No puede exceder 100 caracteres' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Debe ser una cadena' })
    @MinLength(3, { message: 'Debe tener al menos 3 caracteres' })
    @MaxLength(250, { message: 'No puede exceder 250 caracteres' })
    description?: string;

    @IsOptional()
    @IsBoolean()
    priority?: boolean;
}