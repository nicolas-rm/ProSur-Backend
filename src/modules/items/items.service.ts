// src/items/items.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '../../shared/models/index.models';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateItemDto } from './dtos/create-item';
import { UpdateItemDto } from './dtos/update-item';

@Injectable()
export class ItemsService {
    // Constructor para inicializar ...
    constructor(private prisma: PrismaService) {}

    // Metodo para obtener todos los items
    async findAll(userId: number): Promise<Item[]> {
        try {
            return await this.prisma.item.findMany({
                where: { userId },
                orderBy: { id: 'desc' },
            });
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener items falló.');
        }
    }

    // Metodo para obtener un item por id
    async findOne(id: number, userId: number): Promise<Item> {
        try {
            const item = await this.prisma.item.findUnique({ where: { id, userId } });

            if (!item) {
                throw new NotFoundException(`Item con id: ${id} no encontrado.`);
            }

            return item;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener item falló.');
        }
    }

    // Metodo para crear un item
    async create(item: CreateItemDto, userId: number): Promise<Item> {
        try {
            // Transacción para crear un item
            const result = await this.prisma.$transaction(async (prisma) => {
                // Crear item
                const createdItem = await prisma.item.create({ data: { ...item, userId } });

                return createdItem;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Crear item falló.');
        }
    }

    // Metodo para actualizar un item
    async update(id: number, updateData: UpdateItemDto, userId: number): Promise<Item> {
        try {
            // Transacción para actualizar un item
            const result = await this.prisma.$transaction(async (prisma) => {
                // Actualizar item
                const updatedItem = await prisma.item.update({
                    where: { id, userId },
                    data: updateData,
                });

                // Si no se actualiza el item, se lanza una excepción
                if (!updatedItem) {
                    throw new NotFoundException(`Item con id: ${id} no encontrado.`);
                }

                return updatedItem;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Eliminar item falló.');
        }
    }

    // Metodo para eliminar un item
    async delete(id: number, userId: number): Promise<Item> {
        try {
            // Transacción para eliminar un item
            const result = await this.prisma.$transaction(async (prisma) => {
                // Eliminar item
                const deletedItem = await prisma.item.delete({ where: { id, userId } });

                // Si no se elimina el item, se lanza una excepción
                if (!deletedItem) {
                    throw new NotFoundException(`Item con id: ${id} no encontrado.`);
                }

                return deletedItem;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Eliminar item falló.');
        }
    }
}
