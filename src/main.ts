import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MainConfigurations } from './main.config'; // Importa la función de configuración extras del main

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar la validación de datos y forzar el uso de DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Sirve para que no se envíen datos que no estén en el DTO
            transform: true, // Convierte los datos a los tipos que se especifican en el DTO
            forbidNonWhitelisted: true, // Prohíbe el envío de datos que no estén en el DTO
            errorHttpStatusCode: 400, // Cambia el código de error por defecto
        }),
    );

    // Configurar Passport
    MainConfigurations(app);

    await app.listen(3000);
}

bootstrap();
