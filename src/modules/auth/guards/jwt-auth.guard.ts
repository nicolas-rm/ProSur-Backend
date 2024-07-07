import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard utiliza la estrategia 'jwt' para autenticar las solicitudes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // Verifica que se reciba un token JWT en la solicitud
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    // Método para obtener el usuario autenticado
    handleRequest(err, user) {
        if (err || !user) {
            // Si hay un error o el usuario no está presente, lanzar una excepción
            throw err || new UnauthorizedException({ message: 'No autorizado' });
        }
        // Si el usuario está presente, devolverlo
        return user;
    }
}
