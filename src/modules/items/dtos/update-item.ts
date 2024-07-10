// src/items/dto/create-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { /* IsString, IsNotEmpty, IsOptional, */ IsNotEmpty, IsNumber } from 'class-validator';
import { CreateItemDto } from './create-item';

// DTO para crear un item
// Se utiliza para validar los datos que se envian al crear un item
export class UpdateItemDto extends PartialType(CreateItemDto) {
    // Validar id
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Id es un número.' })
    @IsNotEmpty({ message: 'Id es requerido.' })
    id: number;
}
