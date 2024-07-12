import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDTO {
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'ItemId es un número.' })
    @IsOptional()
    itemId?: number;

    // price
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Price es un número.' })
    @IsNotEmpty({ message: 'Price es requerido.' })
    price: number;

    // quantity
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'Quantity es un número.' })
    @IsNotEmpty({ message: 'Quantity es requerido.' })
    quantity: number;
}
