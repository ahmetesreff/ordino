// src/payment/payment.service.ts
import { Injectable, NotFoundException, BadRequestException, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@ordino/database';

export interface ProcessPaymentInput {
    orderId: string;
    amount: number;
    currency: string;
    cardNumber?: string;
}

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';

export interface PaymentInitializationResult {
    transactionReference: string;
}

export interface PaymentProvider {
    initializePayment(input: ProcessPaymentInput): Promise<PaymentInitializationResult>;
    processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult>;
}

export interface ProcessPaymentResult {
    success: boolean;
    message: string;
    transactionReference?: string;
}

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
    private static readonly IYZICO_TEST_CARDS = new Set([
        '5528790000000008',
        '5526080000000006',
        '4111111111111111',
    ]);

    private readonly logger = new Logger(MockPaymentProvider.name);

    async initializePayment(_input: ProcessPaymentInput): Promise<PaymentInitializationResult> {
        return { transactionReference: `iyzico-mock-${Date.now()}` };
    }

    async processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
        if (!input.cardNumber || !MockPaymentProvider.IYZICO_TEST_CARDS.has(input.cardNumber)) {
            return {
                success: false,
                message: 'Mock iyzico payment failed.',
            };
        }

        const { transactionReference } = await this.initializePayment(input);
        this.logger.log(`Mock iyzico transaction: ${transactionReference}`);

        return {
            success: true,
            message: 'Mock iyzico payment succeeded.',
            transactionReference,
        };
    }
}

@Injectable()
export class PaymentService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(PAYMENT_PROVIDER)
        private readonly paymentProvider: PaymentProvider,
    ) { }

    async initializePayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
        if (!input.orderId || input.amount <= 0 || !input.currency) {
            throw new BadRequestException('Invalid payment initialization input');
        }

        const { transactionReference } = await this.paymentProvider.initializePayment(input);

        return {
            success: true,
            message: 'Payment initialized.',
            transactionReference,
        };
    }

    async processPayment(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
        if (!input.orderId || input.amount <= 0 || !input.currency) {
            throw new BadRequestException('Invalid payment initialization input');
        }

        return this.paymentProvider.processPayment(input);
    }

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
        await this.prisma.client.$transaction(async (tx) => {
            // 1. Reserve Stock
            for (const item of order.items) {
                const offer = await tx.offer.findUnique({
                    where: { id: item.offerId },
                    select: { stockQty: true, reservedQty: true }
                });

                if (!offer) {
                    throw new NotFoundException(`Offer ${item.offerId} not found`);
                }

                const reservation = await tx.offer.updateMany({
                    where: {
                        id: item.offerId,
                        reservedQty: offer.reservedQty,
                        stockQty: { gte: offer.reservedQty + item.quantity }
                    },
                    data: { reservedQty: { increment: item.quantity } }
                });

                if (reservation.count !== 1) {
                    throw new BadRequestException(`Insufficient stock to complete order for offer ${item.offerId}`);
                }
            }

            const statusUpdate = await tx.order.updateMany({
                where: {
                    id: orderId,
                    status: OrderStatus.DRAFT,
                },
                data: { status: OrderStatus.PENDING_VERIFICATION }
            });

            if (statusUpdate.count !== 1) {
                throw new BadRequestException('Order cannot be paid from its current state');
            }
        });

        return { success: true, message: `Bank transfer for ${orderId} is awaiting admin verification.` };
    }

    /**
     * Admin verifies the EFT dropped into the bank account
     */
    async verifyBankTransfer(orderId: string) {
        const order = await this.prisma.client.order.findUnique({
            where: { id: orderId }
        });

        if (!order) throw new NotFoundException('Order not found');

        const statusUpdate = await this.prisma.client.order.updateMany({
            where: {
                id: orderId,
                status: OrderStatus.PENDING_VERIFICATION,
            },
            data: { status: OrderStatus.PAID }
        });

        if (statusUpdate.count !== 1) {
            throw new BadRequestException('Order cannot be verified from its current state');
        }

        return this.prisma.client.order.findUnique({
            where: { id: orderId }
        });
    }
}
