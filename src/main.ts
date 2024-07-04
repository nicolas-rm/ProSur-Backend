import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as session from 'express-session'; // Importa el módulo express-session
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Habilitar la validación de datos y forzar el uso de DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            // Habilitar la validación de datos
            whitelist: true,
            // Convertir los datos recibidos a un DTO
            transform: true,
            // Forzar el uso de DTOs
            forbidNonWhitelisted: true,
            // Configurar el código de error HTTP
            errorHttpStatusCode: 400,
        }),
    );

    app.use(
        session({
            secret: 'your-secret-key', // Cambia esto por una clave secreta segura
            resave: false, // No guardar la sesión si no se ha modificado
            saveUninitialized: false, // No guardar una sesión vacía
            // cookie: { maxAge: 3600000 }, // Opcional: Configurar tiempo de vida de la cookie
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    await app.listen(3000);
}
bootstrap();
