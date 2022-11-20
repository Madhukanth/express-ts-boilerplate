import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import passport from 'passport'
import { User } from '@prisma/client'
import { promisify } from 'bluebird'

import APIError from '../errors/api-error'

const handleJWT =
  (req: Request, res: Response, next: NextFunction) =>
  async (err: Error, user: User, info: Error) => {
    const error = err || info
    const logIn = promisify(req.logIn)
    const apiError = new APIError(
      error?.message || 'Unauthorized',
      httpStatus.UNAUTHORIZED,
      error?.stack
    )

    try {
      if (error || !user) throw error
      await logIn(user)
    } catch (e) {
      return next(apiError)
    }

    if (err || !user) {
      return next(apiError)
    }

    req.user = user
    return next()
  }

export const authorize = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, handleJWT(req, res, next))(
    req,
    res,
    next
  )
