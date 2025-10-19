import express from 'express'
import { boardController } from '~/controllers/boardController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddlewares.isAuthorized, boardController.getBoards)
  .post(authMiddlewares.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/supports/moving_card')
  .put(
    authMiddlewares.isAuthorized,
    boardValidation.moveCardToDifferentColumn,
    boardController.moveCardToDifferentColumn
  )

Router.route('/:id')
  .get(
    authMiddlewares.isAuthorized,
    boardController.getDetails
  )
  .put(
    authMiddlewares.isAuthorized,
    boardValidation.update,
    boardController.update
  )

export const boardRoute = Router
