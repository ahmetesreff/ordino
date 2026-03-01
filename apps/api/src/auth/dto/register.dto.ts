import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsString()
    taxNumber: string;

    @IsNotEmpty()
    @IsString()
    taxOffice: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    companyName: string;

    @IsNotEmpty()
    @IsString()
    storeName: string;
}
