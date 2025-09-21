import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async(reqBody) => {
  try {
    // xử lý dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tâng model để sử lý bảng ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard)

    // Lấy bản ghi board sau khi gọi (Tùy mục đích dự án mà có cần bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    console.log('🚀 ~ createNew ~ error:', error)
    throw error
  }
}

const getDetails = async(boardId) => {
  try {

    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError (StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Tạo ra một cái board mới để xử lý, không ảnh hướng với cái ban đầu
    const resBoard = cloneDeep(board)

    resBoard.columns.forEach(c => {
      c.cards = resBoard.cards.filter(card => card.columnId.equals(c._id))
      // c.cards = resBoard.cards.filter(card => card.columnsId.toString() === c._id.toString())
    })

    // xóa mảng card ra khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async(boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async( reqBody) => {
  try {


    //  B1: cập nhật mảng CardOrderIds của column ban đầu chứa nó (Hiểu bản chất là xóa Id cảu card ra khổi mảng)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })
    //  B2: Cập nhật mảng cardOrderIds của column tiếp theo (Hiểu bản chất là thêm _id  của card vào mảng)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    //  B3: cập nhật lại trường columnId card đã kéo
    await cardModel.update(reqBody.curentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Succesfully!' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}