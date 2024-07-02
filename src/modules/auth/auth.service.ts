import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { User } from '../../shared/models/index.models';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    // Valida al usuario comparando la contraseña ingresada con la almacenada en la base de datos
    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email }, include: { roles: true } });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { ...result } = user;
            return result;
        }
        return null;
    }

    // Genera un token JWT para el usuario autenticado
    async login(user: User): Promise<{ access_token: string }> {
        const payload = { username: user.email, sub: user.id, roles: user.roles.map((role) => role.name) };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    // Registra un nuevo usuario en la base de datos
    async register(userDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...userDto,
                password: hashedPassword,
            },
        });
        return user;
    }

    // Método para obtener los roles de un usuario
    async getUserRoles(userId: number): Promise<string[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { roles: { select: { name: true } } },
        });

        if (!user) return [];

        return user.roles.map((role) => role.name);
    }

    // Método para obtener los permisos de un usuario
    async getUserPermissions(userId: number): Promise<string[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { permissions: { select: { entity: true } } },
        });

        if (!user) return [];

        return user.permissions.map((permission) => permission.entity);
    }
}
