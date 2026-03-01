import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OfferService {
    constructor(private prisma: PrismaService) { }

    async createOffer(sellerId: string, data: any) {
        return this.prisma.client.offer.create({
            data: {
                masterSkuId: data.masterSkuId,
                sellerId,
                price: data.price,
                stockQty: data.stockQty,
                minOrderQty: data.minOrderQty,
                leadTimeDays: data.leadTimeDays,
                validUntil: data.validUntil ? new Date(data.validUntil) : null,
            }
        });
    }

    async updateOffer(offerId: string, sellerId: string, data: any) {
        const offer = await this.prisma.client.offer.findFirst({
            where: { id: offerId, sellerId }
        });
        if (!offer) throw new NotFoundException('Offer not found or unauthorized');

        return this.prisma.client.offer.update({
            where: { id: offerId },
            data
        });
    }

    async getActiveOffersBySeller(sellerId: string) {
        return this.prisma.client.offer.findMany({
            where: { sellerId, isActive: true },
            include: { masterSku: true }
        });
    }

    async getOffersForBuyer(skuId: string, buyerCity?: string, buyerDistrict?: string) {
        // Implementing Region filter later, for now returning all active offers for SKU
        return this.prisma.client.offer.findMany({
            where: {
                masterSkuId: skuId,
                isActive: true,
                stockQty: { gt: 0 } // Only offers with stock
            },
            orderBy: { price: 'asc' },
            select: {
                id: true,
                price: true,
                stockQty: true,
                reservedQty: true,
                minOrderQty: true,
                leadTimeDays: true,
                seller: {
                    select: {
                        bizCode: true // Masked identifier for seller (WHS-KOD)
                    }
                }
            }
        });
    }
}
