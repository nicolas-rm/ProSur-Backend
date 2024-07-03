// src/items/items.controller.ts

// NestJS
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';

// Servicios
import { ItemsService } from './items.service';

// Modelos
import { Item } from '../../shared/models/index.models';

// DTOs
import { UpdateItemDto } from './dtos/update-item';
import { CreateItemDto } from './dtos/create-item';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles-guard.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

// Decoradores
import { Permissions } from '../auth/decorators/permissions.decorator';
@Controller('items')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard) // Proteger todos los métodos del controlador con JwtAuthGuard, RolesGuard y PermissionsGuard
export class ItemsController {
    // Constructor para inicializar ...
    constructor(private readonly itemsService: ItemsService) {}

    // EndPoint para obtener todos los items
    @Get()
    @Permissions('Item:read')
    async findAll(): Promise<Item[]> {
        return await this.itemsService.findAll();
    }

    // EndPoint para obtener un item por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Item> {
        return await this.itemsService.findOne(id);
    }

    // EndPoint para crear un item
    @Post()
    async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
        return await this.itemsService.create(createItemDto);
    }

    // EndPoint para actualizar un item
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
        // Validar que el id del item y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateItemDto.id) throw new BadRequestException('Id es requerido.');

        // Validar que el id del item a actualizar sea el mismo que el id del item en el DTO
        if (id !== updateItemDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.update(id, updateItemDto);
    }

    // EndPoint para eliminar un item
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Item> {
        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.delete(id);
    }
}
