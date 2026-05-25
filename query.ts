import { prisma } from './config/db.config';
async function main() {
  const visits = await prisma.visit.findMany();
  console.log("Visits:", visits.map(v => ({ id: v.id, personToMeet: v.personToMeet, approvalStatus: v.approvalStatus })));
}
main().finally(() => prisma.$disconnect());
