// NestJS
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modulos
import { ItemsModule } from './modules/items/items.module';
import { AuthModule } from './modules/auth/auth.module';

// Prisma ORM
import { PrismaService } from './shared/prisma/prisma.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
    imports: [
        ItemsModule,
        PrismaModule,
        AuthModule,
        CategoriesModule,
        ConfigModule.forRoot({
            isGlobal: true, // Hace que la configuración esté disponible globalmente
        }),
        OrdersModule,
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
