import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDTO {
    @IsNumber()
    @IsOptional()
    itemId?: number;
}
