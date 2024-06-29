// src/items/dto/update-item.dto.ts
import { IsNumber } from 'class-validator';
import { CreateItemDto } from './create-item';
import { PartialType } from '@nestjs/mapped-types';

// DTO para actualizar un item
// Se utiliza para validar los datos que se envian al actualizar un item
export class UpdateItemDto extends PartialType(CreateItemDto) {
    // Validar id
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Id es requerido.' })
    id: number;
}
