// src/auth/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' }); // Usa el campo 'email' en lugar de 'username' por defecto.
    }

    // Valida al usuario con el servicio de autenticación.
    async validate(email: string, password: string): Promise<any> {
        if (!email || !password) {
            throw new UnauthorizedException({ message: 'Email y Password son requeridos.' });
        }

        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException({ message: 'Credenciales inválidas.' });
        }
        return user;
    }
}
