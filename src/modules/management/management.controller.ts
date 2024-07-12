// src/items/items.controller.ts

// NestJS
import { Controller, /* Req, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, */ UseGuards } from '@nestjs/common';

// Servicios
import { ManagementService } from './management.service';

// Modelos
// import { Item } from '../../shared/models/index.models';

// DTOs
// import { UpdateItemDto } from './dtos/update-item';
// import { CreateItemDto } from './dtos/create-item';

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { PermissionsAuthGuard } from '../auth/guards/permissions-auth.guard';

// Decoradores
// import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('items')
@UseGuards(JwtAuthGuard, RolesAuthGuard, PermissionsAuthGuard) // Proteger todos los métodos del controlador con JwtAuthGuard, RolesAuthGuard y PermissionsAuthGuard
@Controller('management')
export class ManagementController {
    constructor(private readonly managementService: ManagementService) {}
}
