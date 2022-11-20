import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { promisify } from 'bluebird'
import moment from 'moment'

import * as UserUtils from '../users/user.utils'
import * as AuthUtils from './auth.utils'
import * as AuthValidations from './auth.validation'
import * as UserServices from '../users/users.service'

export const registerUserHandler = async (
  req: Request<{}, UserUtils.UserReturnType, AuthValidations.RegisterUserBody>,
  res: Response<UserUtils.UserReturnType>,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await UserUtils.hashPassword(password)
    const newUser = await UserServices.dbCreateUser(name, email, hashedPassword)
    return res.status(httpStatus.CREATED).send(UserUtils.omitSecrets(newUser))
  } catch (err) {
    next(UserUtils.checkDuplicateEmail(err as Error))
  }
}

export const loginUserHandler = async (
  req: Request<{}, {}, AuthValidations.LoginUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken, user } = await AuthUtils.findAndGenerateToken(req.body)
    res.cookie('jwt', accessToken, {
      expires: moment().add(30, 'days').toDate(),
      httpOnly: true,
    })
    return res.status(httpStatus.OK).send({ user })
  } catch (err) {
    next(err)
  }
}

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logout = promisify(req.logout)
    await logout()
    res.clearCookie('jwt', { httpOnly: true })
    return res.status(httpStatus.OK).send('ok')
  } catch (err) {
    next(err)
  }
}

export const verifyCookieHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user
    return res.status(httpStatus.OK).json({ user })
  } catch (err) {
    next(err)
  }
}
