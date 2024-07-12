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
import { ManagementModule } from './modules/management/management.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        CategoriesModule,
        ItemsModule,
        OrdersModule,
        ConfigModule.forRoot({
            isGlobal: true, // Hace que la configuración esté disponible globalmente
        }),
        ManagementModule,
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
