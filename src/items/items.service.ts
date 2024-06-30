// src/items/items.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '../models/index.models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
    // Constructor para inicializar ...
    constructor(private prisma: PrismaService) {}

    // Metodo para obtener todos los items
    async findAll(): Promise<Item[]> {
        try {
            return await this.prisma.item.findMany();
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
    async findOne(id: number): Promise<Item> {
        try {
            const item = await this.prisma.item.findUnique({ where: { id } });

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
    async create(item: Item): Promise<Item> {
        try {
            return await this.prisma.item.create({ data: item });
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
    async update(id: number, updateData: Partial<Item>): Promise<Item> {
        try {
            const updatedItem = await this.prisma.item.update({ where: { id }, data: updateData });

            if (!updatedItem) {
                throw new NotFoundException(`Item con id: ${id} no encontrado.`);
            }

            return updatedItem;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Actualizar item falló.');
        }
    }

    // Metodo para eliminar un item
    async delete(id: number): Promise<Item> {
        try {
            const deletedItem = await this.prisma.item.delete({ where: { id } });

            if (!deletedItem) {
                throw new NotFoundException(`Item con id: ${id} no encontrado.`);
            }

            return deletedItem;
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
