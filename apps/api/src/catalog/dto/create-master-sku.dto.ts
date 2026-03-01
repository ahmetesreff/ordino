import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMasterSkuDto {
    @IsNotEmpty()
    @IsString()
    gtin: string;

    @IsNotEmpty()
    @IsString()
    brandName: string;

    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsString()
    packageSize: string;

    @IsNotEmpty()
    @IsString()
    categoryId: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;
}
