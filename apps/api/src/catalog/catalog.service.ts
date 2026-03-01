import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
    constructor(private prisma: PrismaService) { }

    async getCategories() {
        return this.prisma.client.category.findMany({
            include: { children: true },
            where: { parentId: null }
        });
    }

    async getMasterSkus(categoryId?: string, search?: string) {
        return this.prisma.client.masterSku.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(search && { productName: { contains: search, mode: 'insensitive' } })
            },
            include: { category: true }
        });
    }

    async getMasterSkuById(id: string) {
        const sku = await this.prisma.client.masterSku.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!sku) throw new NotFoundException('Master SKU not found');
        return sku;
    }

    async createMasterSku(data: any) {
        return this.prisma.client.masterSku.create({
            data: {
                gtin: data.gtin,
                brandName: data.brandName,
                productName: data.productName,
                packageSize: data.packageSize,
                categoryId: data.categoryId,
                imageUrl: data.imageUrl,
            }
        });
    }

    async updateMasterSku(id: string, data: any) {
        return this.prisma.client.masterSku.update({
            where: { id },
            data
        });
    }
}
