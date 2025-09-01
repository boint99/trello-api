import { StatusCodes } from 'http-status-codes'

const createNew = async(req, res, next) => {
  try {
    console.log('🚀 ~ createNew ~ req.body:', req.body)
    res.status(StatusCodes.CREATED).json({ message: 'Note: POST from controller api create new boards.' })
  } catch (error) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: error.message
    })
  }
}

export const boardController = {
  createNew
}