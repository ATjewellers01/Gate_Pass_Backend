"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("./config/db.config");
async function main() {
    console.log('Seeding admin user...');
    const admin = await db_config_1.prisma.user.upsert({
        where: { userId: 'admin' },
        update: {},
        create: {
            userName: 'Admin User',
            userId: 'admin',
            password: 'password123',
            role: 'Admin',
            pageAccess: 'All',
            phone: '1234567890'
        },
    });
    const guard = await db_config_1.prisma.user.upsert({
        where: { userId: 'guard' },
        update: {},
        create: {
            userName: 'Security Guard',
            userId: 'guard',
            password: 'password123',
            role: 'Guard',
            pageAccess: 'GatePass',
            phone: '0987654321'
        },
    });
    console.log('Created users:');
    console.log(admin);
    console.log(guard);
}
main()
    .then(async () => {
    await db_config_1.prisma.$disconnect();
    console.log('Seed successful.');
})
    .catch(async (e) => {
    console.error(e);
    await db_config_1.prisma.$disconnect();
    process.exit(1);
});
