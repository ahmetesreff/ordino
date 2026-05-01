import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@ordino/database';

@Controller('catalog')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    @Get()
    async findMany(
        @Query('category') categoryId?: string,
        @Query('name') name?: string,
        @Query('limit') limit?: string,
        @Query('page') page?: string,
    ) {
        return this.catalogService.findMany({
            categoryId,
            search: name,
            limit: limit ? Number(limit) : undefined,
            page: page ? Number(page) : undefined,
        });
    }

    @Get('categories')
    async getCategories() {
        return this.catalogService.getCategories();
    }

    @Get('master-skus')
    async getMasterSkus(
        @Query('category') categoryId?: string,
        @Query('q') query?: string,
        @Query('limit') limit?: string,
    ) {
        return this.catalogService.getMasterSkus(categoryId, query, limit ? Number(limit) : undefined);
    }

    @Get('master-skus/:id')
    async getMasterSkuById(@Param('id') id: string) {
        return this.catalogService.getMasterSkuById(id);
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.catalogService.getProductById(id);
    }
}
