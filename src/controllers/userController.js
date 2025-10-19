import { StatusCodes } from 'http-status-codes'
import { userServices } from '~/services/userServices'
import ms from 'ms'
import ApiError from '~/utils/ApiError'

const createNew = async(req, res, next) => {
  try {
    const createdUser = await userServices.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async(req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body)

    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const login = async(req, res, next) => {
  try {
    const result = await userServices.login(req.body)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const Logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refeshToken')

    res.status(StatusCodes.OK).json({ LoggedOut: true })
  } catch (error) {
    next(error)
  }
}

const refeshToken = async (req, res, next) => {
  try {
    const result = await userServices.refeshToken(req.cookie?.refeshToken)
    res.cookie('accesstoken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 dáy') })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh Token!)'))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = await req.jwtDecoded._id
    const userAvatarFile = req.file
    console.log('🚀 ~ update ~ userAvatarFile:', userAvatarFile)
    const updateUser = await userServices.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updateUser )
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  Logout,
  refeshToken,
  update
}