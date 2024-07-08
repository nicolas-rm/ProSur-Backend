import { ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    canActivate(context: ExecutionContext) {
        // Log de la solicitud entrante
        const request = context.switchToHttp().getRequest();
        this.logger.log(`Solicitud entrante: ${request.method} ${request.url}`);

        // Llamamos a super.canActivate para que Passport haga su trabajo
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // Log del resultado de la autenticación
        if (err || !user) {
            this.logger.error(`Error de autenticación: ${err?.message || info?.message}`);
        } else {
            this.logger.log(`Usuario autenticado`); // Ajusta según tus datos de usuario
        }

        // Manejo de errores y token faltante
        if (err) {
            throw err; // Si hay un error de Passport, relanzarlo
        } else if (!user) {
            throw new UnauthorizedException({ message: 'Token de autenticación inválido o no proporcionado' }); // Si no hay usuario, lanzar UnauthorizedException
        }

        return user;
    }
}
