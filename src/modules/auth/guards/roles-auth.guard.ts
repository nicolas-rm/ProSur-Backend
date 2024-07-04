import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Obtener los roles requeridos del decorador
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            // Si no hay roles especificados, permitir acceso
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verificar que el usuario esté presente en la solicitud
        if (!user) {
            throw new ForbiddenException('No se encontró usuario en la solicitud');
        }

        // Obtener los roles del usuario
        const userRoles = await this.authService.getUserRoles(user.id);
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));

        // Si el usuario no tiene los roles requeridos, lanzar una excepción ForbiddenException
        if (!hasRole) {
            throw new ForbiddenException('No tienes los roles necesarios');
        }

        return true; // Permitir acceso si tiene los roles requeridos
    }
}
