"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting data transfer...');
    // Read all users
    const users = await prisma.user.findMany();
    const dataToInsert = users.map(user => ({
        personName: user.userName,
        phoneNumber: user.phone || '',
        designation: user.role || null,
        status: 'active',
    }));
    if (dataToInsert.length > 0) {
        const result = await prisma.data.createMany({
            data: dataToInsert,
            skipDuplicates: true
        });
        console.log(`Successfully migrated ${result.count} records from users to data table.`);
    }
    else {
        console.log('No users found to migrate.');
    }
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
