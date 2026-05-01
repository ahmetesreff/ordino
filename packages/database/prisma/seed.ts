import { PrismaClient, Role, BusinessStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@ordino.com' },
    update: {},
    create: {
      email: 'admin@ordino.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const sellerHash = await bcrypt.hash('seller123', 10);
  await prisma.user.upsert({
    where: { email: 'seller@emintoptan.com' },
    update: {},
    create: {
      email: 'seller@emintoptan.com',
      passwordHash: sellerHash,
      role: Role.SELLER,
      isActive: true,
      business: {
        create: {
          taxNumber: '1234567890',
          taxOffice: 'Kadıköy',
          companyName: 'Emin Toptan Gıda A.Ş.',
          storeName: 'Emin Toptan Gıda',
          bizCode: 'WHS-104',
          status: BusinessStatus.APPROVED,
        },
      },
    },
  });

  const buyerHash = await bcrypt.hash('buyer123', 10);
  await prisma.user.upsert({
    where: { email: 'buyer@sefininyeri.com' },
    update: {},
    create: {
      email: 'buyer@sefininyeri.com',
      passwordHash: buyerHash,
      role: Role.BUYER,
      isActive: true,
      business: {
        create: {
          taxNumber: '9876543210',
          taxOffice: 'Beşiktaş',
          companyName: 'Şefin Yeri Ltd. Şti.',
          storeName: 'Şefin Yeri',
          status: BusinessStatus.APPROVED,
        },
      },
    },
  });

  const gida = await prisma.category.upsert({
    where: { id: 'cat-gida' },
    update: {},
    create: { id: 'cat-gida', name: 'Gıda & İçecek' },
  });

  const skus = [
    { id: 'sku-001', gtin: '8690526001001', brandName: 'Komili', productName: 'Ayçiçek Yağı PET', packageSize: '5 Litre' },
    { id: 'sku-002', gtin: '8690526002002', brandName: 'Sinangil', productName: 'Çok Amaçlı Un', packageSize: '25 Kg' },
    { id: 'sku-003', gtin: '8690526003003', brandName: 'Torku', productName: 'Toz Şeker', packageSize: '50 Kg' },
    { id: 'sku-004', gtin: '8690526004004', brandName: 'İçim', productName: 'Yarım Yağlı Süt', packageSize: '1 L x 12' },
  ];

  for (const sku of skus) {
    await prisma.masterSku.upsert({
      where: { id: sku.id },
      update: {},
      create: { ...sku, categoryId: gida.id, imageUrl: null },
    });
  }

  const seller = await prisma.user.findUnique({
    where: { email: 'seller@emintoptan.com' },
    include: { business: true },
  });

  if (seller?.business) {
    const offers = [
      { masterSkuId: 'sku-001', price: 285.50, stockQty: 500, minOrderQty: 5, leadTimeDays: 2 },
      { masterSkuId: 'sku-002', price: 420.00, stockQty: 200, minOrderQty: 2, leadTimeDays: 1 },
      { masterSkuId: 'sku-004', price: 299.90, stockQty: 150, minOrderQty: 3, leadTimeDays: 1 },
    ];

    for (const offer of offers) {
      const existing = await prisma.offer.findFirst({
        where: { masterSkuId: offer.masterSkuId, sellerId: seller.business.id },
      });
      if (!existing) {
        await prisma.offer.create({
          data: { ...offer, sellerId: seller.business.id, isActive: true },
        });
      }
    }
  }

  console.log('\nSeed tamamlandı!');
  console.log('Admin:  admin@ordino.com      / admin123');
  console.log('Seller: seller@emintoptan.com / seller123');
  console.log('Buyer:  buyer@sefininyeri.com / buyer123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
