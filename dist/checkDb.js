"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Users:', await prisma.user.findMany());
    console.log('Data:', await prisma.data.findMany());
}
main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
