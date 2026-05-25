import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Users:', await prisma.user.findMany());
  console.log('Data:', await (prisma as any).data.findMany());
}

main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
