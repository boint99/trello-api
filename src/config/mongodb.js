import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

// Khởi tạo đối tượng trelloDatabaseinstance ban đầu là null (vì chưa kết nối)
let trelloDatabaseInstance = null

// Khởi tạo một đối tượng Client install để connect tới mongdb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
  //  Lưu ý: cái serverAPI có từ phiên bản MongoDB 5.0.0 trở lên, có thể không dùng đến nó
  // còn nếu dùng nó là chúng ra sẽ chỉ định một cái stable API version của mongodb
})

//  connect tới DB
export const CONNECT_DB = async () => {
  //  Gọi kết nối tới mongo tới mongoDB atlas với URI đã khai báo trong thân của mongoClientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lất ra Database theo tên và gán ngược nó lại vào biến trelloDatabaseinstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Function GET_DB (không async) này có nhiệm vụ export ra cái Trello Database install sau khi đẫ connect thành công
// tới Mongodb để chúng ta sử dụng ở nhiều nơi khác nhau trong code.
// Lưu ý phải đảm bảo chỉ luôn gọi cái getDB này sau khi đẫ kết nối tới mongoDB thành công
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect Database first')
  return trelloDatabaseInstance
}

// Đóng kết nối tơi database tới server
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}