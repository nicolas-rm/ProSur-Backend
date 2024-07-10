import { IsNumber, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOrderItemDTO } from './update-order-item';

export class UpdateOrderDTO {
    @IsArray({ message: 'Items debe ser un arreglo.' })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDTO)
    items?: UpdateOrderItemDTO[];

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Id es un número.' })
    @IsNotEmpty({ message: 'Id es requerido.' })
    id: number;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Total es un número.' })
    @IsOptional()
    total?: number;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'UserId es un número.' })
    @IsOptional()
    userId?: number;
}
