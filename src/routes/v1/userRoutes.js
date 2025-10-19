import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUpdateMiddlewares } from '~/middlewares/multerUpdateMiddlewares'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(userValidation.login, userController.login)


Router.route('/logout')
  .delete( userController.Logout)


Router.route('/refesh_token')
  .get(userController.refeshToken)

Router.route('/update')
  .put(
    authMiddlewares.isAuthorized,
    multerUpdateMiddlewares.upload.single('avatar'),
    userValidation.update,
    userController.update
  )

export const userRoutes = Router