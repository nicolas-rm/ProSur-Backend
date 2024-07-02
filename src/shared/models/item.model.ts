import { Order } from './index.models';

export class Item {
    id: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    description?: string;
    name: string;
    order?: Order;
    orderId?: number;
    price: number;
}
