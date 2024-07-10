import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDTO {
    @IsNumber()
    @IsNotEmpty()
    itemId: number;
}
