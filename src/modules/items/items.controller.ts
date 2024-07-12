// src/items/items.controller.ts

// NestJS
import { Controller, Req, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';

// Servicios
import { ItemsService } from './items.service';

// Modelos
import { Item } from '../../shared/models/index.models';

// DTOs
import { UpdateItemDto } from './dtos/update-item';
import { CreateItemDto } from './dtos/create-item';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { PermissionsAuthGuard } from '../auth/guards/permissions-auth.guard';

// Decoradores
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesAuthGuard, PermissionsAuthGuard) // Proteger todos los métodos del controlador con JwtAuthGuard, RolesAuthGuard y PermissionsAuthGuard
export class ItemsController {
    // Constructor para inicializar ...
    constructor(private readonly itemsService: ItemsService) {}

    // EndPoint para obtener todos los items
    @Get()
    @Permissions('Item:read') // Proteger el método con el permiso 'Item:read'
    async findAll(@Req() req): Promise<Item[]> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.itemsService.findAll(userId);
    }

    // EndPoint para obtener un item por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Item> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');
        // Verificar que el item exista
        return await this.itemsService.findOne(id, userId);
    }

    // EndPoint para crear un item
    @Post()
    async create(@Body() createItemDto: CreateItemDto, @Req() req): Promise<Item> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.itemsService.create(createItemDto, userId);
    }

    // EndPoint para actualizar un item
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateItemDto, @Req() req): Promise<Item> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id del item y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateItemDto.id) throw new BadRequestException('Id es requerido.');

        // Validar que el id del item a actualizar sea el mismo que el id del item en el DTO
        if (id !== updateItemDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id, userId);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.update(id, updateItemDto, userId);
    }

    // EndPoint para eliminar un item
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Item> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que el item exista
        const item = await this.itemsService.findOne(id, userId);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Item no encontrado.');

        return await this.itemsService.delete(id, userId);
    }
}
