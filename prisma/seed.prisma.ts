import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
    try {
        // Crear roles si no existen
        const adminRole = await prisma.role.upsert({
            where: { name: 'admin' },
            update: {},
            create: { name: 'admin' },
        });

        const userRole = await prisma.role.upsert({
            where: { name: 'user' },
            update: {},
            create: { name: 'user' },
        });

        // Crear usuarios de ejemplo
        const user1 = await prisma.user.create({
            data: {
                email: 'test1@example.com',
                lastName: 'Doe',
                name: 'John',
                password: await bcrypt.hash('123456', 10),
                roles: {
                    connect: { id: adminRole.id }, // Conectar el usuario al rol de admin
                },
                permissions: {
                    create: [
                        { canRead: true, canWrite: true, entity: 'Item', roleId: adminRole.id }, // Permiso para leer y escribir en Items
                        { canRead: true, canWrite: false, entity: 'Order', roleId: adminRole.id }, // Permiso solo para leer en Orders
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
                    connect: { id: userRole.id }, // Conectar el usuario al rol de user
                },
                permissions: {
                    create: [
                        { canRead: true, canWrite: false, entity: 'Item', roleId: userRole.id }, // Permiso solo para leer en Items
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
            },
        });

        await prisma.order.create({
            data: {
                total: 75.0,
                userId: user2.id,
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
