// NestJS
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';

// Servicios
import { OrdersService } from './orders.service';

// Modelos
import { Order } from '../../shared/models/index.models';

// DTOs
import { CreateOrderDTO } from './dtos/create-order';
import { UpdateOrderDTO } from './dtos/update-order';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { PermissionsAuthGuard } from '../auth/guards/permissions-auth.guard';

// Decoradores
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesAuthGuard, PermissionsAuthGuard) // Proteger todos los métodos del controlador con JwtAuthGuard, RolesAuthGuard y PermissionsAuthGuard
export class OrdersController {
    // Constructor para inicializar OrdersService
    constructor(private readonly ordersService: OrdersService) {}

    // EndPoint para obtener todas las órdenes
    @Get()
    @Permissions('Order:read') // Proteger el método con el permiso 'Order:read'
    async findAll(@Req() req): Promise<Order[]> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.ordersService.findAll(userId);
    }

    // EndPoint para obtener una orden por id
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Order> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.ordersService.findOne(id, userId);
    }

    // EndPoint para crear una orden
    @Post()
    async create(@Body() createOrderDto: CreateOrderDTO, @Req() req): Promise<Order> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        return await this.ordersService.create(createOrderDto, userId);
    }

    // EndPoint para actualizar una orden
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDTO, @Req() req): Promise<Order> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id de la orden y el id del DTO sean proporcionados
        if (!id || isNaN(id)) throw new BadRequestException('Id es requerido.');
        if (!updateOrderDto || isNaN(updateOrderDto.id)) throw new BadRequestException('Id del DTO es requerido.');

        // Validar que el id de la orden a actualizar sea el mismo que el id de la orden en el DTO
        if (id !== updateOrderDto.id) throw new BadRequestException('Id no coincide.');

        // Verificar que la orden exista
        const order = await this.ordersService.findOne(id, userId);

        // Validación si no se encuentra la orden
        if (!order) throw new BadRequestException('Orden no encontrada.');

        return await this.ordersService.update(id, updateOrderDto, userId);
    }

    // EndPoint para eliminar una orden
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Order> {
        const userId = req.user.id; // Obtener el ID del usuario de la solicitud
        if (!userId) throw new BadRequestException('Usuario Id no proporcionado para esta operacion');

        // Validar que el id sea proporcionado
        if (!id) throw new BadRequestException('Id es requerido.');

        // Verificar que la orden exista
        const order = await this.ordersService.findOne(id, userId);

        // Validación si no se encuentra la orden
        if (!order) throw new BadRequestException('Orden no encontrada.');

        return await this.ordersService.delete(id, userId);
    }
}
