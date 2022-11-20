import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

import variables from '../../config/vars'
import APIError from '../../errors/api-error'
import * as UserUtils from '../users/user.utils'
import * as UserServices from '../users/users.service'

export function signJwt(payload: string | Buffer | object) {
  const JWT_SECRET = variables.JWT_SECRET
  const EXPIRES_IN = '30d'
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export const findAndGenerateToken = async (options: {
  email?: string
  password?: string
}) => {
  const { email, password } = options
  if (!email) {
    throw new APIError('An email is required to generate the token')
  }

  if (!password) {
    throw new APIError('Bad Request', httpStatus.UNAUTHORIZED)
  }

  const user = await UserServices.dbFindUserBy({ email })
  if (!user) {
    throw new APIError(`User with email ${email} does not exist`)
  }

  const match = await UserUtils.comparePassword(user.password, password)
  if (!match) {
    throw new APIError('Incorrect email or password')
  }

  const safeUser = UserUtils.omitSecrets(user)
  const token = signJwt(safeUser)
  return { user: safeUser, accessToken: token }
}
