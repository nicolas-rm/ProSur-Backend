// roles.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener los roles requeridos del decorador @Roles usando el Reflector
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());

        // Si no se especifican roles ni permisos, permitir acceso
        if (!requiredRoles && !requiredPermissions) {
            return true;
        }

        // Obtener el usuario desde la solicitud
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verificar los roles del usuario
        const userRoles = await this.authService.getUserRoles(user.id);
        const hasRole = () => !requiredRoles || userRoles.some((role: string) => requiredRoles.includes(role));

        // Verificar los permisos del usuario
        const hasPermission = async () => {
            if (!requiredPermissions) {
                return true; // Si no hay permisos especificados, permitir acceso
            }

            const permissions = await this.authService.getUserPermissions(user.id);
            return permissions.some((permission: string) => requiredPermissions.includes(permission));
        };

        // Si el usuario no tiene los roles requeridos o los permisos necesarios, lanzar una excepción ForbiddenException
        if (!user || !(await hasRole()) || !(await hasPermission())) {
            throw new ForbiddenException('No tienes los roles o permisos necesarios');
        }

        return true; // Permitir acceso si tiene los roles y permisos requeridos
    }
}
