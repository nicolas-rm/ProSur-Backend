import { Role } from './index.models';

export class Permission {
    id: number;
    roleId: number;
    entity: string;
    canRead: boolean;
    canWrite: boolean;
    role?: Role;
}
