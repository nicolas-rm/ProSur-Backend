import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { ...result } = user;
            return result as User;
        }
        return null;
    }

    async login(user: User) {
        const payload = { username: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: { email: string; password: string; name: string; lastName: string }): Promise<User> {
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
        return user;
    }
}
