import { Item, User } from './index.models';

export class Order {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    items?: Item[];
    total: number;
    user?: User;
    userId?: number;
}
