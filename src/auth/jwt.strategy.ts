import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del encabezado de autorización.
            ignoreExpiration: false,
            secretOrKey: 'YOUR_JWT_SECRET', // Clave secreta utilizada para verificar los tokens JWT.
        });
    }

    // Valida el token JWT.
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
