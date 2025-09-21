import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {

  const correctCondition = Joi.object({
    boardId: Joi.string().required().min(3).max(50).trim().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
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

const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    // boardId: Joi.string().min(3).max(50).trim().strict().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })
  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })

    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}

const deleteItem = async(req, res, next) => {
  const correctCondition = Joi.object({
    id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.params)

    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}

export const columnValidation = {
  createNew,
  update,
  deleteItem
}
