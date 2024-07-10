// src/items/dto/create-item.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

// DTO para crear un item
// Se utiliza para validar los datos que se envian al crear un item
export class CreateItemDto {
    // Validar categoryId
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'CategoryId es un número.' })
    @IsNotEmpty({ message: 'CategoryId es requerido.' })
    categoryId: number;

    // Validar description
    @IsString()
    @IsOptional()
    description?: string;

    // Validar name
    @IsString()
    @IsNotEmpty({ message: 'Name es requerido.' })
    name: string;

    // Validar price
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price es un número.' })
    @IsNotEmpty({ message: 'Price es requerido.' })
    // Convetir a número
    price: number;
}
