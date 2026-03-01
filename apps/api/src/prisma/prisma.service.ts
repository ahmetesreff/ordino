import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, PrismaClient } from '@ordino/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    public client: PrismaClient = prisma;

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
