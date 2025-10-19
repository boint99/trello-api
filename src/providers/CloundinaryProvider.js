import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUDE_NAME,
  api_key: env.CLOUDINARY_CLOUDE_KEY,
  api_secret: env.CLOUDINARY_CLOUDE_SECRET
})

export const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    // Dùng streamifier để đẩy buffer lên Cloudinary mà không cần lưu file tạm
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloundinaryProvider = {
  streamUpload
}