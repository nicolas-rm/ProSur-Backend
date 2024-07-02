import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET, // Clave secreta para firmar los tokens JWT.
            signOptions: { expiresIn: '60m' }, // Tiempo de expiración de los tokens JWT.
        }),
    ],
    exports: [AuthService], // Exporta el servicio de autenticación para que esté disponible en otros módulos.
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy], // Servicios y estrategias que este módulo provee.
    controllers: [AuthController], // Controlador que maneja las rutas relacionadas con la autenticación.
})
export class AuthModule {}
