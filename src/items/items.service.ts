// src/items/items.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './item.model';

@Injectable()
export class ItemsService {
    private items: Item[] = [];
    private idCounter = 1;

    // Metodo para obtener todos los items
    findAll(): Item[] {
        return this.items;
    }

    // Metodo para obtener un item por id
    findOne(id: number): Item {
        const item = this.items.find((item) => item.id === id);
        if (!item) {
            throw new NotFoundException(`Item with id ${id} not found`);
        }
        return item;
    }

    // Metodo para crear un item
    create(item: Partial<Item>): Item {
        const newItem = { ...item, id: this.idCounter++ } as Item;
        this.items.push(newItem);
        return newItem;
    }

    // Metodo para actualizar un item
    update(id: number, updateData: Partial<Item>): Item {
        const item = this.findOne(id);
        const updatedItem = { ...item, ...updateData };
        const index = this.items.findIndex((item) => item.id === id);
        this.items[index] = updatedItem;
        return updatedItem;
    }

    // Metodo para eliminar un item
    delete(id: number): void {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) {
            throw new NotFoundException(`Item with id ${id} not found`);
        }
        this.items.splice(index, 1);
    }
}
