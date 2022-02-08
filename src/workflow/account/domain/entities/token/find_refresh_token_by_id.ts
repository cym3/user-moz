import * as TE from 'fp-ts/lib/TaskEither'
import { fail } from '../../../../../core/infra/http_error_response'
import { prisma } from '../../../infra/prisma/client'
import { RefreshTokenByIdDB } from '../../contracts/Token/find_refresh_token_by_id'

export const findRefreshTokenByIdDB: RefreshTokenByIdDB = (id) => {
  const refreshToken = TE.tryCatch(

    async () => {
      const refreshToken = await prisma.userRefreshToken.findUnique({
        where: { id }
      })

      return refreshToken
    },

    (err) => {
      console.log(err)
      return fail(new Error('Oops! Erro. Por favor contacte suporte'))
    }
  )

  return refreshToken
}
