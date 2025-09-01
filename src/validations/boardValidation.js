import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) => {
  /**
   * Note: mặc định chúng ta không cần phải custom message ở phía BE để cho FE tự custom cho đẹp
   * BE: chỉ cần validate dữ liệu đảm bảo chuẩn xác, trả về phía message mặc định từ thư viện
   * Quan trọng: Việc validate dữ liệu là bắt buộc phải có ở phía BE vì đầy là diểm cuối
   * để lưu trữ đữ liệu database
   * và thông thường trong thực tế, điều tối nhất cho hệ thống là hãy luôn validate dữ liệu cả BE và FE
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().message({
      // customs message
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 characters long',
      'string.max': 'Title length must be less than or equal to 5 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: new Error(error).message
    })
  }

}
export const boardValidation = {
  createNew
}
