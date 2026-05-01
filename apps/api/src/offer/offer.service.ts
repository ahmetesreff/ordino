import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';

type UpdateOfferData = Partial<Pick<CreateOfferDto, 'price' | 'quantity' | 'minOrderQty' | 'leadTimeDays'>>;

@Injectable()
export class OfferService {
    constructor(private prisma: PrismaService) { }

    async validateOfferPrice(masterSkuId: string, price: number): Promise<boolean> {
        const product = await this.prisma.client.masterSku.findUnique({
            where: { id: masterSkuId },
            select: { floorPrice: true }
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const { floorPrice } = product;

        if (floorPrice === undefined || floorPrice === null) {
            return true;
        }

        return price > floorPrice;
    }

    async create(sellerId: string, data: CreateOfferDto) {
        const isValidPrice = await this.validateOfferPrice(data.masterSkuId, data.price);

        if (!isValidPrice) {
            throw new BadRequestException('Offer price must be above product floor price');
        }

        return this.prisma.client.offer.create({
            data: {
                masterSkuId: data.masterSkuId,
                sellerId,
                price: data.price,
                stockQty: data.quantity,
                minOrderQty: data.minOrderQty,
                leadTimeDays: data.leadTimeDays,
            }
        });
    }

    async updateOffer(offerId: string, sellerId: string, data: UpdateOfferData) {
        const offer = await this.prisma.client.offer.findFirst({
            where: { id: offerId, sellerId }
        });
        if (!offer) throw new NotFoundException('Offer not found or unauthorized');

        const updateData: {
            price?: number;
            stockQty?: number;
            minOrderQty?: number;
            leadTimeDays?: number;
        } = {};

        if (data.price !== undefined) updateData.price = data.price;
        if (data.quantity !== undefined) updateData.stockQty = data.quantity;
        if (data.minOrderQty !== undefined) updateData.minOrderQty = data.minOrderQty;
        if (data.leadTimeDays !== undefined) updateData.leadTimeDays = data.leadTimeDays;

        return this.prisma.client.offer.update({
            where: { id: offerId },
            data: updateData
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
