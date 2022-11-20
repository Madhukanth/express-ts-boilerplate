import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallback,
} from 'passport-jwt'

import * as UserUtils from '../modules/users/user.utils'
import * as UserServices from '../modules/users/users.service'

import variables from './vars'

const jwtOptions: StrategyOptions = {
  secretOrKey: variables.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
}

const jwtCallback: VerifyCallback = async (payload, done) => {
  try {
    const user = await UserServices.dbFindUserBy({ id: payload.id })
    if (user) return done(null, UserUtils.omitSecrets(user))
    return done(null, false)
  } catch (error) {
    return done(error, false)
  }
}

export const jwt = new JwtStrategy(jwtOptions, jwtCallback)
