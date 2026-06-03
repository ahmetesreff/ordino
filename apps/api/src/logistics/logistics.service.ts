// src/logistics/logistics.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@ordino/database';

@Injectable()
export class LogisticsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Generates a structural JSON or CSV data format that can be exported 
     * to a 3PL logistics provider or warehouse team.
     */
    async exportOrdersForLogistics(dateRangeStart: Date, dateRangeEnd: Date) {
        const orders = await this.prisma.client.order.findMany({
            where: {
                status: { in: [OrderStatus.ACCEPTED, OrderStatus.READY_FOR_PICKUP] },
                createdAt: { gte: dateRangeStart, lte: dateRangeEnd }
            },
            include: {
                buyer: { include: { user: { include: { business: true } } } },
                items: { include: { seller: true, offer: { include: { masterSku: true } } } }
            }
        });

        // Flatten data for CSV/Erp export
        const exportData = [];

        for (const order of orders) {
            for (const item of order.items) {
                exportData.push({
                    order_code: order.orderCode,
                    order_date: order.createdAt.toISOString(),
                    buyer_vkn: order.buyer?.user?.business?.taxNumber,
                    buyer_company: order.buyer?.user?.business?.companyName,
                    seller_code: item.seller?.bizCode || 'UNKNOWN',
                    gtin: item.offer?.masterSku?.gtin,
                    product_name: item.offer?.masterSku?.productName,
                    quantity: item.quantity,
                    status: order.status
                });
            }
        }

        return exportData;
    }
}
