import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionsAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener los permisos requeridos del decorador
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        console.log('Permisos requeridos:', requiredPermissions);
        if (!requiredPermissions) {
            // Si no hay permisos especificados, permitir acceso
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // console.log('Usuario en la solicitud:', user ? user.id : null);

        // Verificar que el usuario esté presente en la solicitud
        if (!user) {
            throw new ForbiddenException('No se encontró usuario en la solicitud');
        }

        // console.log('Informacion del usuario:', user);

        // Obtener los permisos del usuario
        const userPermissions = await this.authService.getUserPermissions(user.id);
        console.log('Permisos del usuario:', userPermissions);

        // Verificar que el usuario tenga todos los permisos requeridos
        // getUserPermissions(userId: number): Promise<{ id: number; canWrite: boolean; canRead: boolean; entity: string }[] | null>
        const hasPermission = requiredPermissions.every((permission) => {
            const userPermission = userPermissions.find((p) => p.entity === permission);
            return userPermission && userPermission.canRead;
        });

        // Si el usuario no tiene todos los permisos requeridos, lanzar una excepción
        if (!hasPermission) {
            throw new ForbiddenException('No tienes permiso para acceder a este recurso');
        }

        return hasPermission;
    }
}
