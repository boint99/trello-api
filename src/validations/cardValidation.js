import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {

  const correctCondition = Joi.object({
    boardId: Joi.string().required().min(3).max(50).trim().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().min(3).max(50).trim().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })


  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}
export const cardValidation = {
  createNew
}
