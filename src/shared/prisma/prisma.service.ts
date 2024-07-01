// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // Metodo para conectar a la base de datos
    async onModuleInit() {
        await this.$connect();
    }

    // Metodo para desconectar de la base de datos
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
