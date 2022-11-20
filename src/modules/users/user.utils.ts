import { User } from '@prisma/client'
import httpStatus from 'http-status'
import omit from 'lodash/omit'
import argon2 from 'argon2'

import APIError from '../../errors/api-error'
import * as UserServices from './users.service'

export type UserReturnType = Omit<User, 'password'>

export const checkDuplicateEmail = (error: Error) => {
  // @ts-ignore
  if (error.name !== 'MongoError' || error.code !== 11000) return error

  return new APIError(
    'Validation Error',
    httpStatus.CONFLICT,
    error.stack,
    [
      {
        field: 'email',
        location: 'body',
        messages: ['"email" already exists'],
      },
    ],
    true
  )
}

export const getSafeUserInfo = (id: string) => {
  return UserServices.dbFindUserByAndSelect(
    { id },
    { id: true, name: true, email: true }
  )
}

export const omitSecrets = (user?: User | Express.User) => {
  return omit(user, ['password']) as UserReturnType
}

export const hashPassword = (password: string) => {
  return argon2.hash(password)
}

export const comparePassword = (hash: string, password: string) => {
  return argon2.verify(hash, password)
}
