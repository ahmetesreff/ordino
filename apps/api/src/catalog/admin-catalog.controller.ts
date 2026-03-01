import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateMasterSkuDto } from './dto/create-master-sku.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@ordino/database';

@Controller('admin/master-skus')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    @Post()
    async createMasterSku(@Body() body: CreateMasterSkuDto) {
        return this.catalogService.createMasterSku(body);
    }

    @Get()
    async getMasterSkus(@Query('category') categoryId: string, @Query('query') query: string) {
        return this.catalogService.getMasterSkus(categoryId, query);
    }

    @Get(':id')
    async getMasterSkuById(@Param('id') id: string) {
        return this.catalogService.getMasterSkuById(id);
    }

    @Patch(':id')
    async updateMasterSku(@Param('id') id: string, @Body() body: any) {
        return this.catalogService.updateMasterSku(id, body);
    }
}
