import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
    await app.listen(3000);
}
bootstrap();
