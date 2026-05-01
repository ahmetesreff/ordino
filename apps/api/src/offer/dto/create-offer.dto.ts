import { IsDefined, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOfferDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    masterSkuId: string;

    @IsDefined()
    @IsNumber()
    @Min(0.01)
    price: number;

    @IsDefined()
    @IsInt()
    @Min(1)
    quantity: number;

    @IsDefined()
    @IsInt()
    @Min(1)
    minOrderQty: number;

    @IsDefined()
    @IsInt()
    @Min(0)
    leadTimeDays: number;
}
