// src/auth/guards/permissions-guard.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener los permisos requeridos del decorador
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            // Si no hay permisos especificados, no permitir el acceso
            return false;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Obtener los permisos del usuario
        const userPermissions = await this.authService.getUserPermissions(user.id);

        // Verificar que el usuario tenga todos los permisos requeridos
        return requiredPermissions.every((permission) => userPermissions.includes(permission));
    }
}
