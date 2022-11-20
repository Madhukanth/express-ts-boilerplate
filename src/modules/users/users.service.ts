import { User } from '@prisma/client'

import { prismaGlobal } from '../../config/db'

export const dbCreateUser = async (
  name: User['name'],
  email: User['email'],
  hashedPassword: string
) => {
  const newUser = await prismaGlobal.user.create({
    data: { name, email, password: hashedPassword },
  })
  return newUser
}

export const dbFindUserBy = async (where: Partial<User>) => {
  const user = await prismaGlobal.user.findUnique({ where })
  return user
}

export const dbFindUserByAndSelect = async (
  where: Partial<User>,
  select: Partial<Record<keyof User, boolean>>
) => {
  const user = await prismaGlobal.user.findUnique({ where, select })
  return user
}
