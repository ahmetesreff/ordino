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

    @Get('categories')
    async getCategories() {
        return this.catalogService.getCategories();
    }

    @Get('master-skus')
    async getMasterSkus(@Query('category') categoryId: string, @Query('q') query: string) {
        return this.catalogService.getMasterSkus(categoryId, query);
    }

    @Get('master-skus/:id')
    async getMasterSkuById(@Param('id') id: string) {
        return this.catalogService.getMasterSkuById(id);
    }
}
