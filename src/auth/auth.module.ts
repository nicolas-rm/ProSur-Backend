import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'YOUR_JWT_SECRET', // Cambia 'YOUR_JWT_SECRET' por una cadena secreta segura.
            signOptions: { expiresIn: '60m' }, // Configura la duración del token JWT.
        }),
    ],
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
