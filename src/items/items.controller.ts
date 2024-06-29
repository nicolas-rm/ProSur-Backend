// src/items/items.controller.ts

// NestJS
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';

// Servicios
import { ItemsService } from './items.service';

// Modelos
import { Item } from './item.model';

// DTOs
import { UpdateItemDto } from './DTO/update-item';
import { CreateItemDto } from './DTO/create-item';

@Controller('items')
export class ItemsController {
    // Constructor para inicializar ...
    constructor(private readonly itemsService: ItemsService) {}

    // Metodo para obtener todos los items
    @Get()
    async findAll(): Promise<Item[]> {
        return await this.itemsService.findAll();
    }

    // Metodo para obtener un item por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
        return await this.itemsService.findOne(id);
    }

    // Metodo para crear un item
    @Post()
    async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
        return await this.itemsService.create(createItemDto);
    }

    // Metodo para actualizar un item
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
        // Validar que el id del item y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateItemDto.id) throw new BadRequestException('Id es requerido.');

        // Validar que el id del item a actualizar sea el mismo que el id del item en el DTO
        if (id !== updateItemDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id);

        // Validar que el item exista
        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.update(id, updateItemDto);
    }

    // Metodo para eliminar un item
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Item> {
        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id);

        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.delete(id);
    }
}
