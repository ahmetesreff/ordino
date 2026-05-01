import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BUYER_ROLE, BUYER_SCOPE } from '@ordino/auth';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class BuyerController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('buyer')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);

        if (!user || user.role !== BUYER_ROLE) {
            throw new UnauthorizedException('Invalid buyer credentials');
        }

        return {
            access_token: this.jwtService.sign({
                email: user.email,
                sub: user.id,
                role: BUYER_ROLE,
                businessId: user.business?.id,
                scope: BUYER_SCOPE,
            }),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}
