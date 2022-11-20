import { object, string, TypeOf } from 'zod'

export const registerUserZod = {
  body: object({
    name: string({ required_error: 'Name is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Must be a valid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(64, 'Password should not be longer than 64 characters'),
  }),
}
export type RegisterUserBody = TypeOf<typeof registerUserZod.body>

export const loginUserZod = {
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Must be a valid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(64, 'Password should not be longer than 64 characters'),
  }),
}
export type LoginUserBody = TypeOf<typeof loginUserZod.body>
