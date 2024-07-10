import { IsNumber, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOrderItemDTO } from './update-order-item';

export class UpdateOrderDTO {
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDTO)
    items?: UpdateOrderItemDTO[];

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsOptional()
    total?: number;

    @IsNumber()
    @IsOptional()
    userId?: number;
}
