import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@ordino/database';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminOrderController {
    constructor(private readonly orderService: OrderService) { }

    @Get()
    async getAllOrders() {
        return this.orderService.getAllOrdersAdmin();
    }

    @Post(':id/force-cancel')
    async forceCancelOrder(@Param('id') id: string) {
        return this.orderService.forceCancelAdminOrder(id);
    }
}
