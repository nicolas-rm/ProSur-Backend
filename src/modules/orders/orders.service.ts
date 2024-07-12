import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateOrderDTO } from './dtos/create-order';
import { UpdateOrderDTO } from './dtos/update-order';
import { Order } from 'src/shared/models/order.model';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    // Método para obtener todas las órdenes
    async findAll(userId: number): Promise<Order[]> {
        try {
            return await this.prisma.order.findMany({
                where: { userId },
                orderBy: { id: 'desc' },
                include: { items: true, user: true },
            });
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener órdenes falló.');
        }
    }

    // Método para obtener una orden por id
    async findOne(id: number, userId: number): Promise<Order> {
        try {
            const order = await this.prisma.order.findUnique({
                where: { id, userId },
                include: { items: true, user: true },
            });

            if (!order) {
                throw new NotFoundException(`Orden con id: ${id} no encontrado.`);
            }

            return order;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener orden falló.');
        }
    }

    // Método para crear una orden
    async create(createOrderDto: CreateOrderDTO, userId: number): Promise<Order> {
        try {
            console.log('Datos a crear');
            console.log(createOrderDto);

            const result = await this.prisma.$transaction(async (prisma) => {
                // Crear la orden
                const createdOrder = await prisma.order.create({
                    data: {
                        total: createOrderDto.total,
                        userId: createOrderDto.userId || userId,
                        items: {
                            create: createOrderDto.items.map((item) => ({
                                itemId: item.itemId,
                                price: item.price,
                                quantity: item.quantity,
                                total: item.price * item.quantity,
                            })),
                        },
                    },
                    include: { items: true, user: true },
                });

                return createdOrder;
            });

            return result;
        } catch (error) {
            console.log('Error al crear');
            console.log(error);
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Crear orden falló.');
        }
    }

    // Método para actualizar una orden
    async update(id: number, updateOrderDto: UpdateOrderDTO, userId: number): Promise<Order> {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const updatedOrder = await prisma.order.update({
                    where: { id },
                    data: {
                        total: updateOrderDto.total,
                        userId: updateOrderDto.userId || userId,
                        items: {
                            deleteMany: { orderId: id },
                            create: updateOrderDto.items?.map((item) => ({
                                itemId: item.itemId,
                                price: item.price,
                                quantity: item.quantity,
                                total: item.price * item.quantity,
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
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Actualizar orden falló.');
        }
    }

    // Método para eliminar una orden
    async delete(id: number, userId: number): Promise<Order> {
        try {
            console.log('Id a eliminar');
            console.log(id);
            const result = await this.prisma.$transaction(async (prisma) => {
                const deletedOrder = await prisma.order.delete({
                    where: { id, userId },
                });

                if (!deletedOrder) {
                    throw new NotFoundException(`Orden con id: ${id} no encontrado.`);
                }

                return deletedOrder;
            });

            return result;
        } catch (error) {
            console.log('Error al eliminar');
            console.log(error);
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Eliminar orden falló.');
        }
    }
}
