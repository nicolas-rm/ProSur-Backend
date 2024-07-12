import { ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service'; // Ajusta la ruta según sea necesario

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(private readonly authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Log de la solicitud entrante
        const request = context.switchToHttp().getRequest();
        this.logger.log(`\n\nSolicitud entrante: ${request.method} ${request.url}`);

        // Obtener el token del encabezado
        const token = request.headers.authorization?.split(' ')[1];
        console.log('JwtAuthGuard');
        console.log(request.headers.authorization);

        if (!token) {
            this.logger.error('Token no proporcionado');
            throw new UnauthorizedException('Token de autenticación no proporcionado');
        }

        // Validar el token
        try {
            const decodedToken = await this.authService.validateToken(token).toPromise();

            // Revisar si el token ha expirado y está dentro del periodo de gracia
            if (this.authService.isTokenExpired(decodedToken)) {
                if (this.authService.isWithinGracePeriod(decodedToken)) {
                    // Renovar el token
                    const newToken = await this.authService.renewToken(decodedToken.userId).toPromise();
                    request.headers.authorization = `Bearer ${newToken}`;
                    this.logger.log('Token renovado');
                } else {
                    this.logger.error('Token expirado y fuera del periodo de gracia');
                    throw new UnauthorizedException('Token expirado y fuera del periodo de gracia');
                }
            }

            // Agregar el usuario a la solicitud
            this.logger.log('Token válido');
            this.logger.log(`Usuario ID: ${decodedToken.userId}`);
            console.log(decodedToken);
            const user = await this.authService.findAuth(decodedToken.sub);
            if (!user) {
                throw new UnauthorizedException('Usuario no encontrado');
            }

            request.user = user;

            return super.canActivate(context) as Promise<boolean>;
        } catch (err) {
            this.logger.error(`Error de autenticación: ${err.message}`);
            throw new UnauthorizedException(err.message);
        }
    }

    handleRequest(err, user, info) {
        // Log del resultado de la autenticación
        if (err || !user) {
            this.logger.error(`Error de autenticación: ${err?.message || info?.message}`);
            throw new UnauthorizedException('Token de autenticación inválido o no proporcionado');
        }

        console.log(user);
        console.log(info);
        this.logger.log(`Usuario autenticado: ${user}`); // Ajusta según tus datos de usuario
        return user;
    }
}
