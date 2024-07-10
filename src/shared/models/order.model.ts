import { /* Item, */ User } from './index.models';

export class Order {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    items?: any[];
    total: number;
    user?: User;
    userId?: number;
}
