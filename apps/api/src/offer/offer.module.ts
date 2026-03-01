import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { SellerOfferController } from './seller-offer.controller';
import { BuyerOfferController } from './buyer-offer.controller';

@Module({
    controllers: [SellerOfferController, BuyerOfferController],
    providers: [OfferService],
    exports: [OfferService],
})
export class OfferModule { }
