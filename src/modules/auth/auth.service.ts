import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Permission, User } from '../../shared/models/index.models';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // Valida si un usuario existe en la base de datos
    async findOne(email?: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            return user;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Verificar usuario falló.');
        }
    }

    // Valida si el usuario autenticado existe (id)
    async findAuth(id: number): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            return user;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Validar usuario por id falló.');
        }
    }

    // Valida al usuario comparando la contraseña ingresada con la almacenada en la base de datos
    async validateUser(email: string, pass: string): Promise<User | null> {
        try {
            const user = await this.prisma.user.findUnique({ where: { email }, include: { roles: true } });
            if (user && (await bcrypt.compare(pass, user.password))) {
                const { ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Validar usuario falló.');
        }
    }

    // Genera un token JWT para el usuario autenticado
    async login(user: User): Promise<{ access_token: string } | null> {
        try {
            const payload = { username: user.email, sub: user.id, roles: user.roles.map((role) => role.name) };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.log('Fallo al generar token:', error);

            // Mensaje de error personalizado
            throw new BadRequestException('Generar token falló.');
        }
    }

    // Registra un nuevo usuario en la base de datos
    async register(userDto: CreateUserDto): Promise<User | null> {
        try {
            const hashedPassword = await bcrypt.hash(userDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    ...userDto,
                    password: hashedPassword,
                },
            });
            return user;
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Registrar usuario falló.');
        }
    }

    // Método para obtener los roles de un usuario
    async getUserRoles(userId: number): Promise<string[] | null> {
        try {
            // Obtener los roles del usuario
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { roles: { select: { name: true } } },
            });

            // Si el usuario no existe retornar un arreglo vacío
            if (!user) return [];

            // Retornar los nombres de los roles del usuario
            return user.roles.map((role) => role.name);
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener roles de usuario falló.');
        }
    }

    // Método para obtener los permisos de un usuario
    async getUserPermissions(userId: number): Promise<Permission[] | null> {
        try {
            console.log('userId:', userId);
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { permissions: true },
            });

            if (!user) return [];

            return user.permissions.map((permission) => permission);
        } catch (error) {
            // Cualquier error que no sea NotFoundException se maneja como BadRequestException
            if (error instanceof NotFoundException) {
                throw error;
            }

            // Mensaje de error personalizado
            throw new BadRequestException('Obtener permisos de usuario falló.');
        }
    }
}
