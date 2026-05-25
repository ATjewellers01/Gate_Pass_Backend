import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Fix users table sequence
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM users;`);
    console.log('Fixed users sequence');
    
    // Might as well fix visits and data sequences too just in case
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('visits', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM visits;`);
    console.log('Fixed visits sequence');
    
    await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('data', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM data;`);
    console.log('Fixed data sequence');
    
  } catch (error) {
    console.error('Failed to fix sequences:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
