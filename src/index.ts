import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'

import { jwt } from './config/passport'
import variables from './config/vars'
import routes from './routes'
import * as error from './middlewares/error'
import logger from './config/logger'

const app = express()

// request logging. dev: console | production: file
app.use(morgan(variables.LOGS))

// parse body params and attache them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// gzip compression
app.use(compress())

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable authentication
app.use(passport.initialize())
passport.use('jwt', jwt)

app.use((req, ...other) =>
  morgan('combined', {
    stream: {
      write: (message) => {
        logger.info(message, {
          method: req.method,
          endpoint: req.originalUrl,
          ip: req.ip,
          ...(req.user || {}),
        })
      },
    },
  })(req, ...other)
)

app.use('/api', routes)

// if error is not an instanceOf APIError, convert it.
app.use(error.converter)

// catch 404 and forward to error handler
app.use(error.notFound)

// error handler, send stacktrace only during development
app.use(error.handler)

app.listen(variables.PORT, () => {
  console.log(`Server listening on port ${variables.PORT}`)
})

process.on('SIGTERM', () => process.exit())
