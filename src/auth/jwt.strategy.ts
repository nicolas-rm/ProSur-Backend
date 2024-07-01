import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el JWT del encabezado de autorización.
            ignoreExpiration: false,
            secretOrKey: 'TOKEN_SECRET', // Clave secreta para verificar la firma del JWT.
        });
    }

    // Valida el token JWT.
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
