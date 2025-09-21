import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async(reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    const createdcard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdcard.insertedId)

    //
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}


export const cardService = {
  createNew
}