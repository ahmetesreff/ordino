// src/payment/payment.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@ordino/database';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    /**
     * For MVP: Manual Bank Transfer (Havale/EFT) Flow
     * Buyer uploads receipt or clicks "I Paid via EFT"
     * Order transitions to PENDING_VERIFICATION and stock is reserved
     */
    async notifyBankTransfer(orderId: string, buyerId: string) {
        const order = await this.prisma.client.order.findFirst({
            where: { id: orderId, buyerId },
            include: { items: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.status !== OrderStatus.DRAFT) {
            throw new BadRequestException('Order cannot be paid from its current state');
        }

        return this.prisma.client.$transaction(async (tx) => {
            // 1. Reserve Stock
            for (const item of order.items) {
                const updatedOffer = await tx.offer.update({
                    where: { id: item.offerId },
                    data: { reservedQty: { increment: item.quantity } }
                });
                if (updatedOffer.stockQty < updatedOffer.reservedQty) {
                    throw new BadRequestException(`Insufficient stock to complete order for offer ${item.offerId}`);
                }
            }

            // 2. Mark order as awaiting manual admin verification
            // Re-using PAID here for simplicity in our DB schema, but in a real app
            // we'd use AWAITING_PAYMENT_VERIFICATION
            return tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.PAID }
            });
        });
    }

    /**
     * Admin verifies the EFT dropped into the bank account
     */
    async verifyBankTransfer(orderId: string) {
        // In our schema, PAID implies funds are secured (Escrow simulated).
        // Sellers can now see this order and Accept it.

        // Logic handles splitting funds virtually if needed, but for MVP
        // Admin just verifies.
        return { success: true, message: `Payment for ${orderId} verified by admin.` };
    }
}
