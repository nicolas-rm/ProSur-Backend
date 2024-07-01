import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del encabezado de autorización.
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // Clave secreta para validar el JWT.
        });
    }

    // Valida el token JWT.
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
