import { PrismaClient } from '@prisma/client';

// Bcrypt para encriptar contraseñas
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    try {
        // Crear usuarios de ejemplo
        const user1 = await prisma.user.create({
            data: {
                email: 'test1@example.com',
                lastName: 'Doe',
                name: 'John',
                password: await bcrypt.hash('123456', 10), // Aquí deberías usar la contraseña encriptada
            },
        });

        const user2 = await prisma.user.create({
            data: {
                email: 'test2@example.com',
                lastName: 'Smith',
                name: 'Jane',
                password: await bcrypt.hash('123456', 10), // Aquí deberías usar la contraseña encriptada
            },
        });

        // Crear roles de ejemplo
        const adminRole = await prisma.role.create({
            data: {
                name: 'admin',
            },
        });

        const userRole = await prisma.role.create({
            data: {
                name: 'user',
            },
        });

        // Asignar roles a usuarios
        await prisma.userToRole.create({
            data: {
                roleId: adminRole.id,
                userId: user1.id,
            },
        });

        await prisma.userToRole.create({
            data: {
                roleId: userRole.id,
                userId: user2.id,
            },
        });

        // Crear órdenes de ejemplo
        await prisma.order.create({
            data: {
                total: 100.0,
                userId: user1.id,
                items: {
                    create: [
                        { name: 'Item 1', price: 50.0 },
                        { name: 'Item 2', price: 50.0 },
                    ],
                },
            },
        });

        await prisma.order.create({
            data: {
                total: 75.0,
                userId: user2.id,
                items: {
                    create: [
                        { name: 'Item 3', price: 25.0 },
                        { name: 'Item 4', price: 50.0 },
                    ],
                },
            },
        });

        console.log('Seed completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
