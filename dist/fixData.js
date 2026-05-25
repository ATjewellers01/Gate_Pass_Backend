"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Delete all records from data table since they were incorrectly migrated from users table
    await prisma.data.deleteMany({});
    console.log('Cleared existing data from Data table.');
    // Find unique persons from visits table just to be safe
    const visits = await prisma.visit.findMany();
    const uniquePersons = [...new Set(visits.map(v => v.personToMeet))];
    if (!uniquePersons.includes('pooja')) {
        uniquePersons.push('pooja');
    }
    // Insert the "pooja" data
    const dataToInsert = uniquePersons.map(person => ({
        personName: person,
        phoneNumber: '',
        designation: 'Employee',
        status: 'active'
    }));
    const result = await prisma.data.createMany({
        data: dataToInsert,
        skipDuplicates: true
    });
    console.log(`Inserted ${result.count} records into Data table:`, uniquePersons);
}
main().catch(console.error).finally(async () => { await prisma.$disconnect(); });
