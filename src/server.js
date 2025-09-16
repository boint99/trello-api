import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = async () => {
  const app = express()

  //  xl cors
  app.use(cors(corsOptions))
  // endble req.body json data
  app.use(express.json())
  app.use('/v1', APIs_V1)

  // Middleware error tập trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {

    console.log(`Hello Tiểu Bối, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })

  // Thực hiên các tác vụ cleanup trước khi dùng server
  exitHook(() => {
    console.log('Server is shutting down...')
    CLOSE_DB()
    console.log('Disconnected server...')
  })
}

// c2: viết Khi kết nối database thành công thì start server backend
(async() => {
  try {
    console.log('Connected to MongoDB Atlas!')
    await CONNECT_DB()
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
// c1: viết Khi kết nối database thành công thì start server backend
// CONNECT_DB()
//   .then(() => {
//     console.log('Connected to MongoDB Atlas!')
//     return START_SERVER()
//   })
//   .then(() => START_SERVER)
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
