import { sign } from 'jsonwebtoken'
import { CreateRefreshAccessToken } from './contracts/CreateRefreshAccessToken'

export const createRefreshAccessToken: CreateRefreshAccessToken = ({ id, userId }) => {
  return sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      subject: userId,
      expiresIn: 60
    }
  )
}
