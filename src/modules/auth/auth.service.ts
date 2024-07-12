import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { Permission, User } from '../../shared/models/index.models';
import { CreateUserDto } from './dtos/create-user.dto';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
    // Minutos de gracia para renovar el token
    private readonly gracePeriodMinutes = 10;

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
    async login(user: User): Promise<{ token: string; user: User; id: number } | null> {
        try {
            const payload = { username: user.email, sub: user.id, roles: user.roles.map((role) => role.name) };
            return {
                token: this.jwtService.sign(payload),
                id: user.id,
                user: user,
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
            // Transacción para crear un usuario
            const result = await this.prisma.$transaction(async (prisma) => {
                // Encriptar la contraseña del usuario
                const hashedPassword = await bcrypt.hash(userDto.password, 10);

                // Crear usuario
                const user = await prisma.user.create({
                    data: {
                        email: userDto.email,
                        name: userDto.name,
                        lastName: userDto.lastName,
                        password: hashedPassword,
                    },
                    include: { roles: true, permissions: true },
                });

                // Asignar roles al usuario
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        roles: {
                            connect: [
                                { id: 1 }, // Role Admin
                                { id: 2 }, // Role User
                            ],
                        },
                    },
                });

                // Asignar permisos únicos al usuario
                const permissions = [
                    { canRead: true, canWrite: true, entity: 'Category' },
                    { canRead: true, canWrite: true, entity: 'Item' },
                    { canRead: true, canWrite: true, entity: 'Order' },
                ];

                for (const permission of permissions) {
                    await prisma.permission.create({
                        data: {
                            ...permission,
                            userId: user.id,
                            roleId: 1, // Asumiendo que el rol Admin es id 1, puedes ajustar según necesites
                        },
                    });
                }

                return user;
            });

            return result;
        } catch (error) {
            console.log('Fallo al registrar usuario:', error);
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

    validateToken(token: string): Observable<any> {
        try {
            const decodedToken = this.jwtService.verify(token);
            return of(decodedToken);
        } catch (e) {
            throw new Error('Invalid token');
        }
    }

    isTokenExpired(decodedToken: any): boolean {
        const now = Math.floor(Date.now() / 1000);
        return decodedToken.exp < now;
    }

    isWithinGracePeriod(decodedToken: any): boolean {
        const now = Math.floor(Date.now() / 1000);
        const expiredTime = decodedToken.exp;
        return now - expiredTime <= this.gracePeriodMinutes * 60;
    }

    renewToken(userId: string): Observable<string> {
        const payload = { userId };
        const newToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Configura el tiempo de expiración según tus necesidades
        return of(newToken);
    }
}
