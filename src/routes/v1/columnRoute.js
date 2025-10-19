import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const Router = express.Router()

// Create a new column
Router.route('/')
  .post(
    authMiddlewares.isAuthorized,
    columnValidation.createNew,
    columnController.createNew
  )

// Update or Delete a column by ID
Router.route('/:id')
  .put(
    authMiddlewares.isAuthorized,
    columnValidation.update,
    columnController.update
  )
  .delete(
    authMiddlewares.isAuthorized,
    columnValidation.deleteItem,
    columnController.deleteItem
  )

export const columnRoute = Router
