import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ where: { phone: null } });
  for (let i = 0; i < users.length; i++) {
    const dummyPhone = `000000000${i}`;
    await prisma.user.update({
      where: { id: users[i].id },
      data: { phone: dummyPhone }
    });
  }
  console.log('Updated null phones to dummy values');
}
main().catch(console.error).finally(() => prisma.$disconnect());
