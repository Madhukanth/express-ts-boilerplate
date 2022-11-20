import dotenvSafe from 'dotenv-safe'
import path from 'path'

dotenvSafe.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
})

const variables = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  LOGS: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
}

export default variables
