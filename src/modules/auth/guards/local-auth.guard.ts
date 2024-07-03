import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { email, password } = request.body;

        // Verificar que email y password estén presentes
        if (!email || !password) {
            throw new UnauthorizedException({ message: 'Email y password son requeridos.' });
        }

        // Llamar al método canActivate del padre (AuthGuard)
        const result = (await super.canActivate(context)) as boolean;

        // Llamar al método logIn del padre (AuthGuard)
        await super.logIn(request);

        return result;
    }
}
