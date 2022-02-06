import * as TE from 'fp-ts/lib/TaskEither'
import { fail } from '../../../../core/infra/http_error_response'
import { prisma } from '../../infra/prisma/client'
import { FindOrSaveUser } from '../contracts/find_or_save_user'

export const findOrSaveUser: FindOrSaveUser = ({ name, email, serverName }) => {
  const user = TE.tryCatch(

    async () => {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (user) {
        return user
      }

      return await prisma.user.create({
        data: {
          name,
          serverName,
          email,
          services: {
            create: {}
          }
        }
      })
    },

    (error) => {
      console.log(error)
      return fail(new Error('Oops! Erro. Por favor contacte suporte'))
    }
  )

  return user
}