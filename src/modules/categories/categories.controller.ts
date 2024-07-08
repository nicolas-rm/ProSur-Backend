// src/items/items.controller.ts

// NestJS
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';

// Servicios
import { CategoriesService } from './categories.service';

// Modelos
import { Category } from '../../shared/models/index.models';

// DTOs
import { CreateCategoryDto } from './dtos/create-category';
import { UpdateCategoryDto } from './dtos/update-category';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { PermissionsAuthGuard } from '../auth/guards/permissions-auth.guard';

// Decoradores
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesAuthGuard, PermissionsAuthGuard) // Proteger todos los métodos del controlador con JwtAuthGuard, RolesAuthGuard y PermissionsAuthGuard
export class CategoriesController {
    // Constructor para inicializar ...
    constructor(private readonly categoriesService: CategoriesService) {}

    // EndPoint para obtener todos los items
    @Get()
    @Permissions('Category:read') // Proteger el método con el permiso 'Item:read'
    async findAll(): Promise<Category[]> {
        return await this.categoriesService.findAll();
    }

    // EndPoint para obtener un item por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return await this.categoriesService.findOne(id);
    }

    // EndPoint para crear un item
    @Post()
    async create(@Body() createItemDto: CreateCategoryDto): Promise<Category> {
        return await this.categoriesService.create(createItemDto);
    }

    // EndPoint para actualizar un item
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateItemDto: UpdateCategoryDto): Promise<Category> {
        // Validar que el id del item y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateItemDto.id) throw new BadRequestException('Id es requerido.');

        // Validar que el id del item a actualizar sea el mismo que el id del item en el DTO
        if (id !== updateItemDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que el item exista
        const item = await this.categoriesService.findOne(id);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Categoria no encontrado.');

        return await this.categoriesService.update(id, updateItemDto);
    }

    // EndPoint para eliminar un item
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que el item exista
        const item = await this.categoriesService.findOne(id);

        // Validación si no se encuentra el item
        if (!item) throw new BadRequestException('Categoria no encontrado.');

        return await this.categoriesService.delete(id);
    }
}
