import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@ordino/database';
import { PrismaService } from '../prisma/prisma.service';

type MasterSkuCreateData = {
    gtin: string;
    brandName: string;
    productName: string;
    packageSize: string;
    categoryId: string;
    imageUrl?: string;
};

type MasterSkuUpdateData = Partial<MasterSkuCreateData>;

@Injectable()
export class CatalogService {
    private static readonly DEFAULT_TAKE = 50;
    private static readonly MAX_TAKE = 100;
    private static readonly DEFAULT_PAGE = 1;

    constructor(private prisma: PrismaService) { }

    async getProducts(categoryId?: string, search?: string, limit?: number, page?: number) {
        const normalizedSearch = search?.trim() || undefined;
        const take = this.getTake(limit);
        const currentPage = this.getPage(page);
        const where: Prisma.MasterSkuWhereInput = {
            ...(categoryId && { categoryId }),
            ...(normalizedSearch && {
                productName: { contains: normalizedSearch, mode: 'insensitive' },
            }),
        };

        const [items, total] = await Promise.all([
            this.prisma.client.masterSku.findMany({
                where,
                skip: (currentPage - 1) * take,
                take,
            }),
            this.prisma.client.masterSku.count({ where }),
        ]);

        return {
            items,
            meta: {
                page: currentPage,
                limit: take,
                total,
                totalPages: Math.ceil(total / take) || 1,
            },
        };
    }

    async findMany(filters: { categoryId?: string; search?: string; limit?: number; page?: number }) {
        return this.getProducts(filters.categoryId, filters.search, filters.limit, filters.page);
    }

    async getCategories() {
        return this.prisma.client.category.findMany({
            include: { children: true },
            where: { parentId: null }
        });
    }

    async getMasterSkus(categoryId?: string, search?: string, limit?: number) {
        const normalizedSearch = search?.trim() || undefined;

        return this.prisma.client.masterSku.findMany({
            where: {
                ...(categoryId && { categoryId }),
                ...(normalizedSearch && {
                    OR: [
                        { productName: { contains: normalizedSearch, mode: 'insensitive' } },
                        { brandName: { contains: normalizedSearch, mode: 'insensitive' } },
                    ],
                }),
            },
            include: { category: true },
            take: this.getTake(limit),
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

    async getProductById(id: string) {
        const product = await this.prisma.client.masterSku.findUnique({
            where: { id }
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async createMasterSku(data: MasterSkuCreateData) {
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

    async updateMasterSku(id: string, data: MasterSkuUpdateData) {
        return this.prisma.client.masterSku.update({
            where: { id },
            data: {
                ...(data.gtin !== undefined && { gtin: data.gtin }),
                ...(data.brandName !== undefined && { brandName: data.brandName }),
                ...(data.productName !== undefined && { productName: data.productName }),
                ...(data.packageSize !== undefined && { packageSize: data.packageSize }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
            }
        });
    }

    private getTake(limit?: number) {
        if (!Number.isFinite(limit)) {
            return CatalogService.DEFAULT_TAKE;
        }

        const take = Math.trunc(limit as number);
        if (take < 1) {
            return CatalogService.DEFAULT_TAKE;
        }

        return Math.min(take, CatalogService.MAX_TAKE);
    }

    private getPage(page?: number) {
        if (!Number.isFinite(page)) {
            return CatalogService.DEFAULT_PAGE;
        }

        const currentPage = Math.trunc(page as number);
        if (currentPage < 1) {
            return CatalogService.DEFAULT_PAGE;
        }

        return currentPage;
    }
}
