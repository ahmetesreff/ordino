import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@ordino/database';

@Controller('seller/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
export class SellerOrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async getOrders(@CurrentUser() user: any) {
        const sellerBusinessId = user.businessId;
        return this.orderService.getSellerOrders(sellerBusinessId);
    }

    @Post(':id/accept')
    async acceptOrder(@Param('id') id: string, @CurrentUser() user: any) {
        const sellerBusinessId = user.businessId;
        return this.orderService.acceptSellerOrder(id, sellerBusinessId);
    }
}
