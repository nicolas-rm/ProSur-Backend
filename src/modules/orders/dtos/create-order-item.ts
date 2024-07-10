import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDTO {
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'ItemId es un número.' })
    @IsNotEmpty({ message: 'ItemId es requerido.' })
    itemId: number;
}
