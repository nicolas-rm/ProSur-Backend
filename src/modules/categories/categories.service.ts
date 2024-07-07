// src/categorias/categorias.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../shared/models/index.models';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category';
import { UpdateCategoryDto } from './dtos/update-category';

@Injectable()
export class CategoriesService {
    // Constructor para inicializar ...
    constructor(private prisma: PrismaService) {}

    // Metodo para obtener todos las categorias
    async findAll(): Promise<Category[]> {
        try {
            return await this.prisma.category.findMany();
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener categorias falló.');
        }
    }

    // Metodo para obtener un categoria por id
    async findOne(id: number): Promise<Category> {
        try {
            const category = await this.prisma.category.findUnique({ where: { id } });

            if (!category) {
                throw new NotFoundException(`Categoria con id: ${id} no encontrado.`);
            }

            return category;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener categoria falló.');
        }
    }

    // Metodo para crear un categoria
    async create(category: CreateCategoryDto): Promise<Category> {
        try {
            // Transacción para crear un categoria
            const result = await this.prisma.$transaction(async (prisma) => {
                // Crear categoria
                const createdCategory = await prisma.category.create({ data: category });

                return createdCategory;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Crear categoria falló.');
        }
    }

    // Metodo para actualizar un categoria
    async update(id: number, updateData: UpdateCategoryDto): Promise<Category> {
        try {
            // Transacción para actualizar un categoria
            const result = await this.prisma.$transaction(async (prisma) => {
                // Actualizar categoria
                const updatedCategory = await prisma.category.update({
                    where: { id },
                    data: updateData,
                });

                // Si no se actualiza el categoria, se lanza una excepción
                if (!updatedCategory) {
                    throw new NotFoundException(`Categoria con id: ${id} no encontrado.`);
                }

                return updatedCategory;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Eliminar categoria falló.');
        }
    }

    // Metodo para eliminar un categoria
    async delete(id: number): Promise<Category> {
        try {
            // Transacción para eliminar un categoria
            const result = await this.prisma.$transaction(async (prisma) => {
                // Eliminar categoria
                const deletedCategory = await prisma.category.delete({ where: { id } });

                // Si no se elimina el categoria, se lanza una excepción
                if (!deletedCategory) {
                    throw new NotFoundException(`Categoria con id: ${id} no encontrado.`);
                }

                return deletedCategory;
            });

            return result;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Eliminar categoria falló.');
        }
    }
}
