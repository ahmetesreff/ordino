import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { BuyerOrderController } from './buyer-order.controller';
import { SellerOrderController } from './seller-order.controller';
import { AdminOrderController } from './admin-order.controller';

@Module({
    controllers: [BuyerOrderController, SellerOrderController, AdminOrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
