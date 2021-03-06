import * as TE from 'fp-ts/lib/TaskEither'
import { clientError, fail, notFound } from '@core/infra/http_error_response'
import { RemoveUserFromTagsService } from '@account/domain/contracts/User/Tags/RemoveUserFromTagsService'
import { DatabaseFailError, EntityNotFoundError } from '@account/domain/entities/errors/db_error'
import { pipe } from 'fp-ts/lib/function'

export const removeUserFromTagsService: RemoveUserFromTagsService = (removeUserFromTagsDB) => (findUserByIdDB) => (validUser) => {
  return pipe(
    TE.tryCatch(
      async () => {
        const userFound = await findUserByIdDB(validUser.userId)

        return userFound
      },
      (err) => clientError(err as Error)
    ),
    TE.chain(userFound => TE.tryCatch(
      async () => {
        if (!userFound) {
          throw new EntityNotFoundError('Oops! A sua não foi encontrada')
        }

        return userFound
      },
      (err) => notFound(err as Error)
    )),
    TE.chain(userFound => TE.tryCatch(
      async () => {
        await removeUserFromTagsDB(validUser)

        return {
          user: userFound,
          tags: validUser.tags
        }
      },

      (err) => {
        console.log(err)
        return fail(new DatabaseFailError('Oops! Erro. Por favor contacte suporte'))
      }
    ))
  )
}
