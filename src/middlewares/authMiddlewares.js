import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  // Lấy access token nằm trong request cookies phí clint - withCredential trong file authorzeAxios
  const clientAccessToken = req.cookies?.accessToken

  // Nếu như client AccressTooken ko tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }
  try {
    // B1: thực hiện giải mã token kiểm tra token
    const accessTokenDecoded = await jwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    console.log('🚀 ~ accessTokenDecoed:', accessTokenDecoded)
    // B2: quan trọng: nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được trong req
    // jwtDecoded , để được sử dụng các tầng sử lý ở phí sau
    req.jwtDecoded = accessTokenDecoded
    // B3: cho phép cái request đi tiếp
    next()
  } catch (error) {
    console.log('🚀 ~ isAuthorized ~ error:', error)
    // Nếu accessToken nó bị hết hạn thì trả vê lỗi
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Access token expired. Please refresh token.'))
      return
    }

    // Nếu accesstoken nó ko hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về lỗi 401
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddlewares = { isAuthorized }