import * as TE from 'fp-ts/lib/TaskEither'
import { fail } from '@core/infra/http_error_response'
import { prisma } from '@account/infra/prisma/client'
import { FindUserByEmailDB } from '@account/domain/contracts/User/Login/find_user_by_email'

export const findUserByEmailDB: FindUserByEmailDB = (email) => {
  const user = TE.tryCatch(
    async () => {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          services: true
        }
      })
    },

    (err) => {
      console.log(err)
      return fail(new Error('Oops! Erro. Por favor contacte suporte'))
    }
  )

  return user
}