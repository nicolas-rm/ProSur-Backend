// src/items/items.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { Item } from '../../shared/models/index.models';
import { PrismaService } from 'src/shared/prisma/prisma.service';
// import { CreateItemDto } from './dtos/create-item';
// import { UpdateItemDto } from './dtos/update-item';

@Injectable()
export class ManagementService {
    constructor(private prisma: PrismaService) {}

    // Metodo para Obtener productos vendidos en un periodo de fechas
    async getSoldProductsInPeriod(startDate: Date, endDate: Date) {
        try {
            const report = this.prisma.orderItem.findMany({
                where: {
                    order: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                include: {
                    item: true,
                },
            });

            return report;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener items falló.');
        }
    }

    // Metodo para obtener los 3 productos más vendidos
    async getTop3SoldProducts(): Promise<any[]> {
        try {
            const report = await this.prisma.orderItem.groupBy({
                by: ['itemId'],
                _sum: {
                    quantity: true,
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                take: 3,
            });

            // Obtener los datos de los productos
            const products = await this.prisma.item.findMany({
                where: { id: { in: report.map((item) => item.itemId) } },
            });

            // Mapear los datos de los productos
            const mappedReport = report.map((item) => {
                const product = products.find((product) => product.id === item.itemId);

                return {
                    ...item,
                    product,
                };
            });

            // Retornar el reporte
            return mappedReport;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Obtener items mas vendidos falló.');
        }
    }

    // Obtener ventas por productos
    async getSalesByProduct() {
        try {
            const report = await this.prisma.orderItem.groupBy({
                by: ['itemId'],
                _sum: {
                    orderId: true,
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
            });

            // Obtener los datos de los productos
            const products = await this.prisma.item.findMany({
                where: { id: { in: report.map((item) => item.itemId) } },
            });

            // Mapear los datos de los productos
            const mappedReport = report.map((item) => {
                const product = products.find((product) => product.id === item.itemId);

                return {
                    ...item,
                    product,
                };
            });

            return mappedReport;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Obtener ventas por productos falló.');
        }
    }
}
