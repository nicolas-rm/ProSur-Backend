import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDTO {
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'ItemId es un número.' })
    @IsOptional()
    itemId?: number;
}
