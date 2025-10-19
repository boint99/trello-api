import JWT from 'jsonwebtoken'


const generateToken = (userInfo, secretSignature, tokenLife) => {
  try {
    // sign token với thuật toán HS256
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw error
  }
}

export const jwtProvider = {
  verifyToken,
  generateToken
}