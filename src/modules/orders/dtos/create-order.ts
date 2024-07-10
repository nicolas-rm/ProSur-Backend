import { IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDTO } from './create-order-item';

export class CreateOrderDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDTO)
    items: CreateOrderItemDTO[];

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}
