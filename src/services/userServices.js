import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import bcrypt from 'bcryptjs'
import { jwtProvider } from '~/providers/jwtProvider'
import { env } from '~/config/environment'
import { CloundinaryProvider } from '~/providers/CloundinaryProvider'
// import { WEBSITE_DOMAIN } from '~/utils/constants'
// import { brevoProvider } from '~/providers/Brevoprovider'

const createNew = async (reqBody) => {
  try {
    //Kiểm tra xem email đã tồn tại trong hệ thống
    const exsitUser = await userModel.findOneByEmail(reqBody.email)
    if (exsitUser) {
      throw new ApiError (StatusCodes.CONFLICT, 'Email already exists!')
    }
    // tạo data lưu vào database
    // nameFromEmail: nếu email là trung boint@gmail.com thì sẽ lấy được boint
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,

      verifyToken: uuidv4(),
      isActive: true
    }
    // Thực hiện lưu thông tin vào DB
    // Gọi tới tâng model để sử lý bảng ghi newBoard vào trong database
    const createdUser = await userModel.createNew(newUser)

    // Lấy bản ghi board sau khi gọi (Tùy mục đích dự án mà có cần bước này hay không)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gửi email cho người dùng tạo tài khoảng

    // Tính năng gửi email bị lỗ ở api brove nên tạm thời  off
    // const verifyTokenLink = `http://${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`

    // const customsubject = 'Please verify your email  before using our services'
    // const htmlContent = `
    //   <h3>Here is your verification link: </h3>
    //   <h3>${verifyTokenLink}</h3>
    // `

    // //   gọi tới provider
    // await brevoProvider.sendEmail(getNewUser.email, customsubject, htmlContent)
    // trả về dữ liệu
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async(reqBody) => {
  try {
    const exsitUser = await userModel.findOneByEmail(reqBody.email)
    if (!exsitUser) {
      throw new ApiError (StatusCodes.NOT_FOUND, 'Email already exists!')
    }
    if (exsitUser.isActive ) throw new ApiError (StatusCodes.NOT_ACCEPTABLE, 'Your account is alreadey active!')

    if (reqBody.token !== exsitUser) throw new ApiError (StatusCodes.NOT_ACCEPTABLE, 'token not valid already active!')
    const updateData = {
      isActive: true,
      verifyAccount: null
    }
    console.log('🚀 ~ verifyAccount ~ updateData:', updateData)
    const updateUser = await userModel.update(exsitUser._id, updateData )
    console.log('🚀 ~ verifyAccount ~ updateUser:', updateUser)
  } catch (error) {
    throw error
  }
}


const login = async (reqBody) => {
  try {
    // Tìm user theo email
    const existUser = await userModel.findOneByEmail(reqBody.email)
    console.log('🚀 ~ login ~ existUser:', existUser)

    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    }

    if (!existUser.isActive) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active')
    }

    // Kiểm tra mật khẩu
    const isMatch = bcrypt.compareSync(reqBody.password, existUser.password)
    if (!isMatch) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or password is incorrect')
    }

    //  Nếu token ok
    // Tạo thông tin đính kèm ttrong jwt
    const userInfo = {
      _id:existUser._id,
      email: existUser.email

    }
    // tạo 2 loại

    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await jwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )
    // Nếu pass đúng thì return user (hoặc token tuỳ ý bạn)
    return { accessToken, refreshToken, ...pickUser(existUser) }
    // return existUser
  } catch (error) {
    throw error
  }
}

const refeshToken = async(clientRefreshToken) => {
  try {
    const refeshTokenDecoded = await jwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refeshTokenDecoded._id,
      email: refeshTokenDecoded.email
    }

    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) {
    throw error
  }

}

const update = async(userId, reqBody, userAvatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError (StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive === false) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    }

    let updatedUser = { }
    // Trường hợp change password
    if (reqBody.current_password && reqBody.new_password) {
      //  kiểm tra xem passowrd hiện tại có đúng hay ko
      if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }
      // Nếu current_password đúng thì chúng ta sẽ hash 1 cái mật khẩu mới và update lại vào db
      updatedUser = await userModel.update(userId, {
        password:  bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvatarFile) {
      // upload file lên clound lên storage
      const uploadResult = await CloundinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      console.log('🚀 ~ update ~ uploadResult:', uploadResult)

      // Lưu lại url(secure_url) của dile ảnh trong db
      updatedUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url
      })
    } else {
      //  Trường hợp update các thông tin chung...
      updatedUser = await userModel.update(userId, {
        updatedUser: await userModel.update(existUser._id, reqBody)
      })
    }
    return pickUser (updatedUser)
  } catch (error) {
    throw error
  }

}

export const userServices = {
  createNew,
  verifyAccount,
  login,
  refeshToken,
  update
}