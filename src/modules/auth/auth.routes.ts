import express from 'express'
import { processRequestBody } from 'zod-express-middleware'

import * as AuthHandler from './auth.controller'
import * as AuthVaidations from './auth.validation'

export default () => {
  const api = express.Router()

  api.post(
    '/register',
    processRequestBody<AuthVaidations.RegisterUserBody>(
      AuthVaidations.registerUserZod.body
    ),
    AuthHandler.registerUserHandler
  )
  api.post(
    '/login',
    processRequestBody<AuthVaidations.LoginUserBody>(
      AuthVaidations.loginUserZod.body
    ),
    AuthHandler.loginUserHandler
  )

  return api
}
