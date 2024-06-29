// src/items/items.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './item.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
    // Constructor para inicializar ...
    constructor(private prisma: PrismaService) {}

    // Metodo para obtener todos los items
    async findAll(): Promise<Item[]> {
        return await this.prisma.item.findMany();
    }

    // Metodo para obtener un item por id
    async findOne(id: number): Promise<Item> {
        const findOneItem = await this.prisma.item.findUnique({ where: { id } });

        if (!findOneItem) {
            throw new NotFoundException(`Item con id: ${id} no encontrado.`);
        }

        return findOneItem;
    }

    // Metodo para crear un item
    async create(item: Item): Promise<Item> {
        return await this.prisma.item.create({ data: item });
    }

    // Metodo para actualizar un item
    async update(id: number, updateData: Partial<Item>): Promise<Item> {
        const updateItem = await this.prisma.item.update({ where: { id }, data: updateData });

        if (!updateItem) {
            throw new NotFoundException(`Item con id: ${id} no encontrado.`);
        }

        return updateItem;
    }

    // Metodo para eliminar un item
    async delete(id: number): Promise<Item> {
        const deleteItem = await this.prisma.item.delete({ where: { id } });

        if (!deleteItem) {
            throw new NotFoundException(`Item con id: ${id} no encontrado.`);
        }

        return deleteItem;
    }
}
