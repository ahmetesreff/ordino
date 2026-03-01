import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@ordino/database';

@Controller('buyer/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class BuyerOrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async createOrder(@CurrentUser() user: any, @Body() body: CreateOrderDto) {
        const buyerBusinessId = user.businessId; // Replace with actual logic pulling from user
        return this.orderService.createDraftOrder(buyerBusinessId, body.items);
    }

    @Post(':id/pay') // This would be the Havale mark as paid in MVP or PSP in future
    async mockPay(@Param('id') id: string, @CurrentUser() user: any) {
        const buyerBusinessId = user.businessId;
        return this.orderService.markOrderAsPaid(id, buyerBusinessId);
    }

    @Get()
    async getOrders(@CurrentUser() user: any) {
        const buyerBusinessId = user.businessId;
        return this.orderService.getBuyerOrders(buyerBusinessId);
    }
}
