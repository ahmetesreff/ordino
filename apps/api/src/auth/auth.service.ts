import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, BusinessStatus } from '@ordino/database';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    private static readonly INVALID_PASSWORD_HASH = '$2b$10$' + '.'.repeat(53);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateBuyerCredentials(email: string, pass: string): Promise<any> {
        const user = await this.prisma.client.user.findUnique({
            where: { email },
        });

        const candidatePasswordHash = user?.passwordHash ?? AuthService.INVALID_PASSWORD_HASH;
        const isMatch = await bcrypt.compare(pass, candidatePasswordHash);

        if (!user || user.role !== Role.BUYER || !user.isActive || !isMatch) {
            return null;
        }

        const { passwordHash, ...result } = user;
        return result;
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.client.user.findUnique({
            where: { email },
            include: { business: true }
        });

        const candidatePasswordHash = user?.passwordHash ?? AuthService.INVALID_PASSWORD_HASH;
        const isMatch = await bcrypt.compare(pass, candidatePasswordHash);

        if (!user || (!user.isActive) || !isMatch) return null;

        if (
            user.role === Role.BUYER ||
            (user.role !== Role.ADMIN && user.business?.status !== BusinessStatus.APPROVED)
        ) {
            return null; // Reject login if business is not approved
        }

        const { passwordHash, ...result } = user;
        return result;
    }

    async login(email: string, pass: string) {
        const user = await this.validateUser(email, pass);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials or account inactive');
        }

        return this.signToken(user);
    }

    async loginBuyer(email: string, pass: string) {
        const user = await this.validateBuyerCredentials(email, pass);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials or account inactive');
        }

        return this.signToken(user);
    }

    private signToken(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, businessId: user.business?.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async createUser(data: RegisterDto, role: Role) {
        await this.ensureEmailAvailable(data.email);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.client.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                role,
                ...(role !== Role.BUYER
                    ? {
                        business: {
                            create: {
                                taxNumber: data.taxNumber,
                                taxOffice: data.taxOffice,
                                companyName: data.companyName,
                                storeName: data.storeName,
                            }
                        }
                    }
                    : {})
            },
            include: { business: true }
        });

        const { passwordHash, ...result } = user;
        return result;
    }

    async registerBuyer(data: RegisterDto) {
        const user = await this.createUser(data, Role.BUYER);
        return this.signToken(user);
    }

    async registerSeller(data: RegisterDto, actorRole?: Role) {
        if (actorRole !== Role.ADMIN) {
            throw new ForbiddenException();
        }
        return this.createUser(data, Role.SELLER);
    }

    private async ensureEmailAvailable(email: string) {
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }
    }
}
