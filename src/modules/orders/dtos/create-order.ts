import { IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDTO } from './create-order-item';

export class CreateOrderDTO {
    @IsArray({ message: 'Items debe ser un arreglo.' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDTO)
    items: CreateOrderItemDTO[];

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Total es un número.' })
    @IsNotEmpty({ message: 'Total es requerido.' })
    total: number;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'UserId es un número.' })
    @IsNotEmpty({ message: 'UserId es requerido.' })
    userId: number;
}
