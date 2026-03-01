import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role, BusinessStatus } from '@ordino/database';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.client.user.findUnique({
            where: { email },
            include: { business: true }
        });

        if (!user || (!user.isActive)) return null;

        if (user.role !== Role.ADMIN && user.business?.status !== BusinessStatus.APPROVED) {
            return null; // Reject login if business is not approved
        }

        const isMatch = await bcrypt.compare(pass, user.passwordHash);
        if (isMatch) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, businessId: user.business?.id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async registerBuyer(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Draft logic for creating a user and a business
        const user = await this.prisma.client.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                role: Role.BUYER,
                business: {
                    create: {
                        taxNumber: data.taxNumber,
                        taxOffice: data.taxOffice,
                        companyName: data.companyName,
                        storeName: data.storeName,
                    }
                }
            },
            include: { business: true }
        });

        const { passwordHash, ...result } = user;
        return result;
    }

    async registerSeller(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Draft logic for creating a user and a business (seller)
        const user = await this.prisma.client.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                role: Role.SELLER,
                business: {
                    create: {
                        taxNumber: data.taxNumber,
                        taxOffice: data.taxOffice,
                        companyName: data.companyName,
                        storeName: data.storeName,
                    }
                }
            },
            include: { business: true }
        });

        const { passwordHash, ...result } = user;
        return result;
    }
}
