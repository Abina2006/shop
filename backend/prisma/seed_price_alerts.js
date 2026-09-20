import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAlerts() {
  const user = await prisma.user.findFirst();
  if (!user) return;

  const boat = await prisma.product.findFirst({ where: { name: { contains: 'Airdopes' } }, include: { listings: true } });
  const mac = await prisma.product.findFirst({ where: { name: { contains: 'MacBook Air' } }, include: { listings: true } });
  const samsung = await prisma.product.findFirst({ where: { name: { contains: 'S24 Ultra' } }, include: { listings: true } });

  if (boat && boat.listings.length > 0) {
    await prisma.priceAlert.create({
      data: {
        userId: user.id,
        listingId: boat.listings[0].id,
        targetPrice: 999,
        isActive: true
      }
    }).catch(() => {});
  }

  if (mac && mac.listings.length > 0) {
    await prisma.priceAlert.create({
      data: {
        userId: user.id,
        listingId: mac.listings[0].id,
        targetPrice: 85000,
        isActive: true
      }
    }).catch(() => {});
  }

  if (samsung && samsung.listings.length > 0) {
    await prisma.priceAlert.create({
      data: {
        userId: user.id,
        listingId: samsung.listings[0].id,
        targetPrice: 115000,
        isActive: true
      }
    }).catch(() => {});
  }

  const count = await prisma.priceAlert.count();
  console.log(`✅ Seeded sample price alerts! Total: ${count}`);
  await prisma.$disconnect();
}

seedAlerts();
