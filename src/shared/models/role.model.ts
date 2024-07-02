import { User, Permission } from './index.models';

export class Role {
    id: number;
    name: string;
    users?: User[];
    permissions?: Permission[];
}
