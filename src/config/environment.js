import 'dotenv/config'

// lấy toàn bộ thông tin từ .env
export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  AUTHOR: process.env.AUTHOR
}

// require('dotenv').config()
// console.log(process.env.AUTHOR)