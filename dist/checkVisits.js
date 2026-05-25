"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const visits = await prisma.visit.findMany();
    console.log('Unique Persons to Meet in visits:', [...new Set(visits.map(v => v.personToMeet))]);
}
main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
