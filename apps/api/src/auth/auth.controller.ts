import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials or account inactive');
        }
        return this.authService.login(user);
    }

    @Post('register/buyer')
    async registerBuyer(@Body() body: RegisterDto) {
        return this.authService.registerBuyer(body);
    }

    @Post('register/seller')
    async registerSeller(@Body() body: RegisterDto) {
        return this.authService.registerSeller(body);
    }
}
