import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '@core/infra/middleware'
import { clientError } from '@core/infra/http_error_response'
import { ok } from '@core/infra/http_success_response'
import { updateUserNamePropsValidate } from '@account/services/validate/user/updateUser/update_user_name_props'
import { updateUserNameDB } from '@account/domain/entities/user/updateUser/update_user_name'
import { updateUserNameService } from '@account/services/user/update/update_user_name'
import { findUserByIdDB } from '@account/domain/entities/user/findUser/find_user_by_id'

export const updateUserName: Middleware = (_httpRequest, httpBody) => {
  const { name, userId } = httpBody

  const unValidatedUser = { userId, name }

  const httpResponse = pipe(
    unValidatedUser,
    updateUserNamePropsValidate,
    E.mapLeft(error => clientError(error)),
    TE.fromEither,
    TE.chain(validUser => pipe(
      validUser,
      updateUserNameService(updateUserNameDB)(findUserByIdDB),
      TE.map(user => {
        const UserNameUpdatedEvent = {
          name: user.name
        }

        return ok(UserNameUpdatedEvent)
      })

    ))
  )

  return httpResponse
}
