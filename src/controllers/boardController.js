import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async(req, res, next) => {
  try {
    // throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Test error')
    // console.log('🚀 ~ createNew ~ req.body:', req.body)

    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(userId, req.body)

    // có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async(req, res, next) => {
  try {
    const boardId = req.params.id
    const userId = req.jwtDecoded._id
    // Điều hướng dữ liệu sang tầng service
    const board = await boardService.getDetails(userId, boardId)

    // có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async(req, res, next) => {
  try {
    const boardId = req.params.id

    // Điều hướng dữ liệu sang tầng service
    const updatedBoard = await boardService.update(boardId, req.body)

    // có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async(req, res, next) => {
  try {

    // Điều hướng dữ liệu sang tầng service
    const result = await boardService.moveCardToDifferentColumn(req.body)

    // có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}


const getBoards = async(req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const { page, itemsPerPage } = req.query
    const result = await boardService.getBoards(userId, page, itemsPerPage)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}