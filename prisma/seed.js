import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const filePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  './seed.sql'
);

async function runSeed() {
  const sqlContent = fs.readFileSync(filePath, 'utf8');

  const queries = sqlContent
    .split(';')
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  try {
    for (const query of queries) {
      await prisma.$executeRawUnsafe(query);
    }
    console.log('Seed script executed successfully!');
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();
