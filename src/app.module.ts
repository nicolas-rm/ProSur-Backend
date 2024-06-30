import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ItemsModule, PrismaModule, AuthModule],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
