import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
    @IsNotEmpty()
    @IsString()
    masterSkuId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0.01)
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    stockQty: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    minOrderQty: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    leadTimeDays: number;
}
