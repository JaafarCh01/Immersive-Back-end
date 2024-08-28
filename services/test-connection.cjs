const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT 1+1 AS result`
    console.log('Connection successful:', result)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()