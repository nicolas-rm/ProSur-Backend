import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MainConfigurations } from './main.config'; // Importa la función de configuración extras del main

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar la validación de datos y forzar el uso de DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: 400,
        }),
    );

    // Configurar Passport
    MainConfigurations(app);

    await app.listen(3000);
}

bootstrap();
