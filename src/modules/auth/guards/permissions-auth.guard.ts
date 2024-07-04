import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service'; // Importación del servicio de autenticación

@Injectable()
export class PermissionsAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, // Reflector para acceder a los metadatos de los decoradores
        private authService: AuthService, // Servicio de autenticación para obtener permisos del usuario
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            // Obtener los permisos requeridos del decorador usando el Reflector
            const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
            if (!requiredPermissions) {
                // Si no hay permisos especificados, permitir acceso
                return true;
            }

            // Obtener la solicitud HTTP del contexto
            const request = context.switchToHttp().getRequest();
            const user = request.user; // Obtener el usuario de la solicitud

            // Verificar que el usuario esté presente en la solicitud
            if (!user) {
                throw new ForbiddenException('No se encontró usuario en la solicitud');
            }

            // Obtener los permisos del usuario desde el servicio de autenticación
            const userPermissions = await this.authService.getUserPermissions(user.id);

            // Verificar que el usuario tenga todos los permisos requeridos
            const hasPermission = requiredPermissions.every((permission) => {
                const permissionEntity = userPermissions.find((p) => permission.includes(p.entity));

                if (permissionEntity) {
                    // Verificar permisos según el tipo (lectura o escritura)
                    if (permission.includes('read')) {
                        return permissionEntity.canRead === true;
                    } else if (permission.includes('write')) {
                        return permissionEntity.canWrite === true;
                    }
                }

                return false; // El usuario no tiene el permiso requerido
            });

            // Si el usuario no tiene todos los permisos requeridos, lanzar una excepción
            if (!hasPermission) {
                throw new ForbiddenException('No tienes permiso para acceder a este recurso');
            }

            return true; // Permitir acceso si el usuario tiene todos los permisos requeridos
        } catch (error) {
            // Manejo de excepciones
            if (error instanceof ForbiddenException) {
                throw error; // Lanzar excepción ForbiddenException si ocurre
            }

            // Otras excepciones pueden manejarse aquí, como errores de base de datos

            throw new ForbiddenException('Error de permisos'); // Lanzar una excepción genérica para otros errores
        }
    }
}
