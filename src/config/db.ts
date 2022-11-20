import { PrismaClient } from '@prisma/client'

import variables from './vars'

declare global {
  var prisma: PrismaClient | undefined
}

export const prismaGlobal =
  global.prisma || new PrismaClient({ log: ['query'] })

if (variables.NODE_ENV !== 'production') {
  global.prisma = prismaGlobal
}
