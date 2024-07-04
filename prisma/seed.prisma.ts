import { PrismaClient } from '@prisma/client';
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
                password: await bcrypt.hash('123456', 10),
                roles: {
                    connect: { name: 'admin' }, // Conectar el usuario al rol de admin
                },
                permissions: {
                    create: [
                        { canRead: true, canWrite: true, entity: 'Item', roleId: 1 }, // Permiso para leer y escribir en Items
                        { canRead: true, canWrite: false, entity: 'Order', roleId: 1 }, // Permiso solo para leer en Orders
                    ],
                },
            },
            include: {
                roles: true,
                permissions: true,
            },
        });

        const user2 = await prisma.user.create({
            data: {
                email: 'test2@example.com',
                lastName: 'Smith',
                name: 'Jane',
                password: await bcrypt.hash('123456', 10),
                roles: {
                    connect: { name: 'user' }, // Conectar el usuario al rol de user
                },
                permissions: {
                    create: [
                        { canRead: true, canWrite: false, entity: 'Item', roleId: 2 }, // Permiso solo para leer en Items
                    ],
                },
            },
            include: {
                roles: true,
                permissions: true,
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
