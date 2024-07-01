// NestJS
import { Module } from '@nestjs/common';

// Modulos
import { ItemsModule } from './items/items.module';

// Prisma ORM
import { PrismaService } from './prisma/prisma.service';

// Modulos
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

// Configuración
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ItemsModule,
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true, // Hace que la configuración esté disponible globalmente
        }),
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
