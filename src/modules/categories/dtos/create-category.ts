// src/categorys/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// DTO para crear un category
// Se utiliza para validar los datos que se envian al crear un category
export class CreateCategoryDto {
    // Validar name
    @IsString()
    @IsNotEmpty({ message: 'Name es requerido.' })
    name: string;

    // Validar description
    @IsString()
    @IsOptional()
    description?: string;
}
