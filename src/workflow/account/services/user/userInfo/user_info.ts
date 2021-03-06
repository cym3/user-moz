import * as TE from 'fp-ts/lib/TaskEither'
import { clientError, fail } from '@core/infra/http_error_response'
import { getUserInfoService } from '@account/domain/contracts/User/UserInfo/UserInfo'
import { DatabaseFailError, EntityNotFoundError } from '@account/domain/entities/errors/db_error'
import { pipe } from 'fp-ts/lib/function'

export const userInfoService: getUserInfoService = (getUserInfoDB) => (userId) => {
  return pipe(
    TE.tryCatch(
      async () => await getUserInfoDB(userId),

      (err) => {
        console.log(err)
        return fail(new DatabaseFailError('Oops! Erro. Por favor contacte suporte'))
      }
    ),
    TE.chain(user => {
      return TE.tryCatch(
        async () => {
          if (!user) {
            throw new EntityNotFoundError('Oops! Conta não encontrada')
          }

          return user
        },

        notFoundUserError => clientError(notFoundUserError as Error)
      )
    })
  )
}
