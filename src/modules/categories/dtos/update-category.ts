// src/items/dto/create-item.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { /* IsString, IsNotEmpty, IsOptional, */ IsNotEmpty, IsNumber } from 'class-validator';
import { CreateCategoryDto } from './create-category';

// DTO para crear un item
// Se utiliza para validar los datos que se envian al crear un item
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    // Validar id
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Id es un número.' })
    @IsNotEmpty({ message: 'Id es requerido.' })
    id: number;
}
