"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("./config/db.config");
async function main() {
    const visits = await db_config_1.prisma.visit.findMany();
    console.log("Visits:", visits.map(v => ({ id: v.id, personToMeet: v.personToMeet, approvalStatus: v.approvalStatus })));
}
main().finally(() => db_config_1.prisma.$disconnect());
