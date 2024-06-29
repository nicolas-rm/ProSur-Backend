// src/items/dto/update-item.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// DTO para actualizar un item
// Se utiliza para validar los datos que se envian al actualizar un item
export class UpdateItemDto {
    // // Validar id
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Id es un número.' })
    @IsOptional()
    id: number;

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
}
