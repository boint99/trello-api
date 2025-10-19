import multer from 'multer'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/validators'

// function kiểm tra loại file nào được chấp nhận
const customfileFilter = (req, file, callback) => {
  console.log('Multer File:', file)
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(errorMessage, null)
  }
  // Nếu như kiểu file hợp lệ
  return callback(null, true)
}

// Khỏi tạo func update được bọc bởi muilter

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customfileFilter
})

export const multerUpdateMiddlewares = {
  upload
}