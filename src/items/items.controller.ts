// src/items/items.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './item.model';

@Controller('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    // Metodo para obtener todos los items
    @Get()
    findAll(): Item[] {
        return this.itemsService.findAll();
    }

    // Metodo para obtener un item por id
    @Get(':id')
    findOne(@Param('id') id: string): Item {
        return this.itemsService.findOne(Number(id));
    }

    // Metodo para crear un item
    @Post()
    create(@Body() item: Partial<Item>): Item {
        return this.itemsService.create(item);
    }

    // Metodo para actualizar un item
    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<Item>): Item {
        return this.itemsService.update(Number(id), updateData);
    }

    // Metodo para eliminar un item
    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.itemsService.delete(Number(id));
    }
}
