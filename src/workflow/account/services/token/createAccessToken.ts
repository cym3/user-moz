import { sign } from 'jsonwebtoken'
import { CreateAccessToken } from '../../domain/contracts/CreateIdToken'

export const createAccessToken: CreateAccessToken = (userId) => {
  return sign(
    {},
    process.env.ACCESS_TOKEN_SECRET!,
    {
      subject: userId,
      expiresIn: '10m'
    }
  )
}
