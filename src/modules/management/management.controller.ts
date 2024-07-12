import { Controller, Get, BadRequestException, Query } from '@nestjs/common';

import { ManagementService } from './management.service';

@Controller('management')
export class ManagementController {
    constructor(private readonly managementService: ManagementService) {}

    // Endpoint para obtener productos vendidos en un periodo de fechas
    @Get('sold-products')
    async getSoldProductsInPeriod(@Query('startDate' /* , ParseDatePipe */) startDate: Date, @Query('endDate' /* , ParseDatePipe */) endDate: Date) {
        try {
            return await this.managementService.getSoldProductsInPeriod(startDate, endDate);
        } catch (error) {
            throw new BadRequestException('Error al obtener productos vendidos en el periodo de fechas.');
        }
    }

    // Endpoint para obtener los 3 productos más vendidos
    @Get('top-3-sold-products')
    async getTop3SoldProducts() {
        try {
            return await this.managementService.getTop3SoldProducts();
        } catch (error) {
            throw new BadRequestException('Error al obtener los 3 productos más vendidos.');
        }
    }

    // Endpoint para obtener las ventas por productos
    @Get('sales-by-product')
    async getSalesByProduct() {
        try {
            return await this.managementService.getSalesByProduct();
        } catch (error) {
            throw new BadRequestException('Error al obtener las ventas por productos.');
        }
    }
}
