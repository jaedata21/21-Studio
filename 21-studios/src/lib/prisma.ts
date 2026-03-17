import { PrismaClient } from '@prisma/client'

declare global { var __prisma: PrismaClient | undefined }

function getPrisma(): PrismaClient {
  if (!global.__prisma) global.__prisma = new PrismaClient({ log: ['error'] })
  return global.__prisma
}

const prisma = new Proxy({} as PrismaClient, {
  get(_t, prop) { return getPrisma()[prop as keyof PrismaClient] }
})

export default prisma
