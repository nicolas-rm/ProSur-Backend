import { Order } from './index.models';

export class User {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    email: string;
    password: string;
    name: string;
    lastName: string;
    orders?: Order[];
}
