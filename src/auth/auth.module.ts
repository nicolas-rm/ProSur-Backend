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
            secret: process.env.JWT_SECRET, // Clave secreta para firmar los tokens JWT.
            signOptions: { expiresIn: '60m' }, // Tiempo de expiración de los tokens JWT.
        }),
    ],
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy], // Servicios y estrategias que este módulo provee.
    controllers: [AuthController], // Controlador que maneja las rutas relacionadas con la autenticación.
})
export class AuthModule {}
