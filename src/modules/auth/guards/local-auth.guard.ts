import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;

        // Verificar que el email y password estén presentes en la solicitud
        if (!email || !password) {
            throw new UnauthorizedException({ message: 'Email y password son requeridos.' });
        }

        // Llamar al método canActivate del padre (AuthGuard) para la autenticación
        const result = (await super.canActivate(context)) as boolean;
        console.log('Auth result:', result);
        console.log('User after auth:', request.user);

        // Verificar si la autenticación fue exitosa antes de intentar iniciar sesión
        if (result) {
            return new Promise<boolean>((resolve, reject) => {
                console.log('LogIn user:', request);
                request.logIn(request.user, (err) => {
                    if (err) {
                        console.error('LogIn error:', err);
                        reject(new UnauthorizedException('No se pudo iniciar sesión'));
                    } else {
                        console.log('User logged in:', request.user);
                        resolve(true);
                    }
                });
            });
        }

        return result;
    }
}
