import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const createNew = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message( EMAIL_RULE_MESSAGE ),
    password: Joi.string().required().pattern(PASSWORD_RULE).message( PASSWORD_RULE_MESSAGE )

  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}

const verifyAccount = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE ),
    password: Joi.string().required()

  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}


const login = async(req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message( EMAIL_RULE_MESSAGE ),
    password: Joi.string().required().pattern(PASSWORD_RULE).message( PASSWORD_RULE_MESSAGE )

  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}


const update = async(req, res, next) => {
  const correctCondition = Joi.object({
    current_password:Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE ),
    new_password:Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE ),
    displayName: Joi.string().trim().strict()

  })

  try {
    // abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tât cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // Vailidate dữ liệu hợp lệ thì cho reques tiếp sang controller
    next()

  } catch (error) {
    const errorMessage = new Error(error).message
    const customErrorMessage =new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customErrorMessage)
  }

}

export const userValidation = {
  createNew,
  verifyAccount,
  login,
  update
}
