import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { OfferService } from './offer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@ordino/database';

@Controller('catalog/master-skus')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.BUYER)
export class BuyerOfferController {
    constructor(private readonly offerService: OfferService) { }

    @Get(':skuId/offers')
    async getOffersForSku(@Param('skuId') skuId: string, @Request() req: any) {
        // We can extract buyer's region from req.user to filter offers
        return this.offerService.getOffersForBuyer(skuId);
    }
}
