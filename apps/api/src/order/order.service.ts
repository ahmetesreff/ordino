import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@ordino/database';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    private readonly allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.DRAFT]: [OrderStatus.PENDING_PAYMENT, OrderStatus.PENDING_VERIFICATION, OrderStatus.PAID, OrderStatus.CANCELLED],
        [OrderStatus.PENDING_PAYMENT]: [OrderStatus.PAID, OrderStatus.CANCELLED],
        [OrderStatus.PENDING_VERIFICATION]: [OrderStatus.PAID, OrderStatus.CANCELLED],
        [OrderStatus.PAID]: [OrderStatus.ACCEPTED, OrderStatus.CANCELLED],
        [OrderStatus.ACCEPTED]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
        [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.IN_DELIVERY, OrderStatus.CANCELLED],
        [OrderStatus.IN_DELIVERY]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
        [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
        [OrderStatus.COMPLETED]: [],
        [OrderStatus.CANCELLED]: []
    };

    async updateStatus(orderId: string, status: OrderStatus) {
        return this.prisma.client.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId }
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            const currentStatus = order.status as OrderStatus;
            const nextAllowedStatuses = this.allowedTransitions[currentStatus];

            if (!nextAllowedStatuses || !nextAllowedStatuses.includes(status)) {
                throw new BadRequestException(`Invalid status transition from ${currentStatus} to ${status}`);
            }

            return tx.order.update({
                where: { id: order.id },
                data: { status }
            });
        });
    }

    async createDraftOrder(buyerId: string, items: { offerId: string, quantity: number }[]) {
        // 1. Fetch offers
        const offerIds = items.map(i => i.offerId);
        const offers = await this.prisma.client.offer.findMany({
            where: { id: { in: offerIds }, isActive: true }
        });

        if (offers.length !== items.length) {
            throw new BadRequestException('Some offers are invalid or inactive');
        }

        let totalAmount = 0;
        const orderItemsData = items.map(item => {
            const offer = offers.find(o => o.id === item.offerId);
            if (!offer) {
                throw new BadRequestException(`Offer ${item.offerId} not found`);
            }
            if (offer.stockQty - offer.reservedQty < item.quantity) {
                throw new BadRequestException(`Insufficient stock for offer ${offer.id}`);
            }
            if (item.quantity < offer.minOrderQty) {
                throw new BadRequestException(`Quantity below minimum order for offer ${offer.id}`);
            }
            const itemTotal = Number(offer.price) * item.quantity;
            totalAmount += itemTotal;
            return {
                offerId: offer.id,
                sellerId: offer.sellerId,
                unitPriceAtPurchase: offer.price,
                quantity: item.quantity
            };
        });

        // 2. Create Order in DRAFT state
        const orderCode = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const order = await this.prisma.client.order.create({
            data: {
                buyerId,
                orderCode,
                totalAmount,
                status: OrderStatus.DRAFT,
                items: {
                    create: orderItemsData
                }
            },
            include: { items: true }
        });

        return order;
    }

    async markOrderAsPaid(orderId: string, buyerId: string) {
        const order = await this.prisma.client.order.findFirst({
            where: { id: orderId, buyerId },
            include: { items: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.status !== OrderStatus.DRAFT) {
            throw new BadRequestException('Order is not in DRAFT state');
        }

        // Wrap in transaction: update order status + reserve stock
        return this.prisma.client.$transaction(async (tx) => {
            for (const item of order.items) {
                // Optimistic locking or where conditions can be added to prevent race conditions
                const updatedOffer = await tx.offer.update({
                    where: { id: item.offerId },
                    data: {
                        reservedQty: { increment: item.quantity }
                    }
                });
                if (updatedOffer.stockQty < updatedOffer.reservedQty) {
                    throw new BadRequestException('Stock reserved exceeded available stock during payment');
                }
            }

            const updateResult = await tx.order.updateMany({
                where: { id: orderId, status: OrderStatus.DRAFT },
                data: { status: OrderStatus.PAID }
            });

            if (updateResult.count !== 1) {
                throw new BadRequestException('Order status changed before this update could be applied');
            }

            return tx.order.findUniqueOrThrow({
                where: { id: orderId }
            });
        });
    }

    async getBuyerOrders(buyerId: string) {
        return this.prisma.client.order.findMany({
            where: { buyerId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getSellerOrders(sellerId: string) {
        // Seller only sees orders where they have items, and status >= PAID
        return this.prisma.client.order.findMany({
            where: {
                items: { some: { sellerId } },
                status: { in: [OrderStatus.PAID, OrderStatus.ACCEPTED, OrderStatus.READY_FOR_PICKUP, OrderStatus.IN_DELIVERY, OrderStatus.DELIVERED, OrderStatus.COMPLETED] }
            },
            include: {
                items: { where: { sellerId } } // Only include their own items
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async acceptSellerOrder(orderId: string, sellerId: string) {
        const order = await this.prisma.client.order.findFirst({
            where: { id: orderId, items: { some: { sellerId } } }
        });
        if (!order) throw new NotFoundException('Order not found or unauthorized');

        return this.updateStatus(orderId, OrderStatus.ACCEPTED);
    }

    async getAllOrdersAdmin() {
        return this.prisma.client.order.findMany({
            include: { items: true, buyer: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async forceCancelAdminOrder(orderId: string) {
        return this.prisma.client.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: { items: true }
            });

            if (!order) throw new NotFoundException('Order not found');

            // Release reserved stock assuming it was previously reserved
            // A more complex real-world flow would check if status was >= PAID etc.
            if (
                order.status === OrderStatus.PAID ||
                order.status === OrderStatus.ACCEPTED ||
                order.status === OrderStatus.READY_FOR_PICKUP ||
                order.status === OrderStatus.IN_DELIVERY
            ) {
                for (const item of order.items) {
                    await tx.offer.update({
                        where: { id: item.offerId },
                        data: { reservedQty: { decrement: item.quantity } }
                    });
                }
            }

            return tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED }
            });
        });
    }
}
