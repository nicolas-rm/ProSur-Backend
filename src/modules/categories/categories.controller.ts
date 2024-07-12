// NestJS
import { Controller, Req, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';

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
    async findAll(@Req() req): Promise<Category[]> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.categoriesService.findAll(userId);
    }

    // EndPoint para obtener una categoría por id
    @Get(':id')
    @Permissions('Category:read') // Proteger el método con el permiso 'Category:read'
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Category> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');

        return await this.categoriesService.findOne(id, userId);
    }

    // EndPoint para crear una categoría
    @Post()
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:write'
    async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req): Promise<Category> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.categoriesService.create(createCategoryDto, userId);
    }

    // EndPoint para actualizar una categoría
    @Put(':id')
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:write'
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req): Promise<Category> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id de la categoría y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateCategoryDto.id) throw new BadRequestException('Id del DTO es requerido.');

        // Validar que el id de la categoría a actualizar sea el mismo que el id de la categoría en el DTO
        if (id !== updateCategoryDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que la categoría exista
        const category = await this.categoriesService.findOne(id, userId);

        // Validación si no se encuentra la categoría
        if (!category) throw new BadRequestException('Categoría no encontrada.');

        return await this.categoriesService.update(id, updateCategoryDto, userId);
    }

    // EndPoint para eliminar una categoría
    @Delete(':id')
    @Permissions('Category:write') // Proteger el método con el permiso 'Category:delete'
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Category> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que la categoría exista
        const category = await this.categoriesService.findOne(id, userId);

        // Validación si no se encuentra la categoría
        if (!category) throw new BadRequestException('Categoría no encontrada.');

        return await this.categoriesService.delete(id, userId);
    }
}
