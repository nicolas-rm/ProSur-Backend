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
    // Constructor para inicializar CategoriesService
    constructor(private readonly categoriesService: CategoriesService) {}

    // EndPoint para obtener todas las categorías
    @Get()
    @Permissions('Category:read') // Proteger el método con el permiso 'Category:read'
    async findAll(): Promise<Category[]> {
        return await this.categoriesService.findAll();
    }

    // EndPoint para obtener una categoría por id
    @Get(':id')
    @Permissions('Category:read') // Proteger el método con el permiso 'Category:read'
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return await this.categoriesService.findOne(id);
    }

    // EndPoint para crear una categoría
    @Post()
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:write'
    async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoriesService.create(createCategoryDto);
    }

    // EndPoint para actualizar una categoría
    @Put(':id')
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:write'
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        // Validar que el id de la categoría y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateCategoryDto.id) throw new BadRequestException('Id del DTO es requerido.');

        // Validar que el id de la categoría a actualizar sea el mismo que el id de la categoría en el DTO
        if (id !== updateCategoryDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que la categoría exista
        const category = await this.categoriesService.findOne(id);

        // Validación si no se encuentra la categoría
        if (!category) throw new BadRequestException('Categoría no encontrada.');

        return await this.categoriesService.update(id, updateCategoryDto);
    }

    // EndPoint para eliminar una categoría
    @Delete(':id')
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:delete'
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que la categoría exista
        const category = await this.categoriesService.findOne(id);

        // Validación si no se encuentra la categoría
        if (!category) throw new BadRequestException('Categoría no encontrada.');

        return await this.categoriesService.delete(id);
    }
}
