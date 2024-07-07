// src/items/dto/create-item.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

// DTO para crear un item
// Se utiliza para validar los datos que se envian al crear un item
export class CreateItemDto {
    // Validar name
    @IsString({ message: 'Name es requerido.' })
    @IsNotEmpty({ message: 'Name no puede estar vacío.' })
    name: string;

    // Validar description
    @IsString()
    @IsOptional()
    description?: string;

    // Validar price
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price es requerido.' })
    price: number;

    // Validar categoryId
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'CategoryId es requerido.' })
    categoryId: number;
}
