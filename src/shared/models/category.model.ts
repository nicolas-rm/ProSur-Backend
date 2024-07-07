import { Item } from './index.models';

export class Category {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    description?: string;
    items?: Item[];
}
