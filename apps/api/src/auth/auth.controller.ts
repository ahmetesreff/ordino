import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.email, body.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login/buyer')
    async loginBuyer(@Body() body: LoginDto) {
        return this.authService.loginBuyer(body.email, body.password);
    }

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.registerBuyer(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('register/seller')
    async registerSeller(@Body() body: RegisterDto, @Req() req: any) {
        return this.authService.registerSeller(body, req.user?.role);
    }
}
