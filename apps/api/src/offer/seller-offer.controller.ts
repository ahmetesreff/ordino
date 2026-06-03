import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@ordino/database';

@Controller('seller/offers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
export class SellerOfferController {
    constructor(private readonly offerService: OfferService) { }

    @Post()
    async createOffer(@CurrentUser() user: any, @Body() body: CreateOfferDto) {
        // Assuming user.sub is the userId, we need sellerBusinessId. 
        // In actual implementation, CurrentUser should fetch the related Business object.
        const sellerBusinessId = user.businessId;
        return this.offerService.create(sellerBusinessId, body);
    }

    @Patch(':id')
    async updateOffer(@Param('id') id: string, @CurrentUser() user: any, @Body() body: any) {
        const sellerBusinessId = user.businessId;
        return this.offerService.updateOffer(id, sellerBusinessId, body);
    }

    @Get()
    async getActiveOffers(@CurrentUser() user: any) {
        const sellerBusinessId = user.businessId;
        return this.offerService.getActiveOffersBySeller(sellerBusinessId);
    }
}
