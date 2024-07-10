import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateOrderDTO } from './dtos/create-order';
import { UpdateOrderDTO } from './dtos/update-order';
import { Order } from 'src/shared/models/order.model';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    // Método para obtener todas las órdenes
    async findAll(): Promise<Order[]> {
        try {
            return await this.prisma.order.findMany({
                orderBy: { id: 'desc' },
                include: { items: true, user: true },
            });
        } catch (error) {
            throw new BadRequestException('Obtener órdenes falló.');
        }
    }

    // Método para obtener una orden por id
    async findOne(id: number): Promise<Order> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id },
                include: { items: true, user: true },
            });

            if (!order) {
                throw new NotFoundException(`Orden con id: ${id} no encontrado.`);
            }

            return order;
        } catch (error) {
            throw new BadRequestException('Obtener orden falló.');
        }
    }

    // Método para crear una orden
    async create(createOrderDto: CreateOrderDTO): Promise<Order> {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const createdOrder = await prisma.order.create({
                    data: {
                        total: createOrderDto.total,
                        userId: createOrderDto.userId,
                        items: {
                            create: createOrderDto.items.map((item) => ({
                                itemId: item.itemId,
                            })),
                        },
                    },
                    include: { items: true, user: true },
                });

                return createdOrder;
            });

            return result;
        } catch (error) {
            throw new BadRequestException('Crear orden falló.');
        }
    }

    // Método para actualizar una orden
    async update(id: number, updateOrderDto: UpdateOrderDTO): Promise<Order> {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const updatedOrder = await prisma.order.update({
                    where: { id },
                    data: {
                        total: updateOrderDto.total,
                        userId: updateOrderDto.userId,
                        items: {
                            deleteMany: { orderId: id },
                            create: updateOrderDto.items?.map((item) => ({
                                itemId: item.itemId,
                            })),
                        },
                    },
                    include: { items: true, user: true },
                });

                if (!updatedOrder) {
                    throw new NotFoundException(`Orden con id: ${id} no encontrado.`);
                }

                return updatedOrder;
            });

            return result;
        } catch (error) {
            throw new BadRequestException('Actualizar orden falló.');
        }
    }

    // Método para eliminar una orden
    async delete(id: number): Promise<Order> {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const deletedOrder = await prisma.order.delete({
                    where: { id },
                    include: { items: true, user: true },
                });

                if (!deletedOrder) {
                    throw new NotFoundException(`Orden con id: ${id} no encontrado.`);
                }

                return deletedOrder;
            });

            return result;
        } catch (error) {
            throw new BadRequestException('Eliminar orden falló.');
        }
    }
}
