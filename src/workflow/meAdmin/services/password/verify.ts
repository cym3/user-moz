import bcrypt from 'bcrypt'
import { VerifyPassword } from './contracts/Verify'

export const verifyPassword: VerifyPassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash)
  return result
}
