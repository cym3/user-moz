import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '@core/infra/middleware'
import { clientError } from '@core/infra/http_error_response'
import { ok } from '@core/infra/http_success_response'
import { createAccessToken } from '@meAdmin/services/token/access'
import { meAdminLoggerPropsValidate } from '@meAdmin/services/validate/login/meadmin_logger_props'
import { findAdminByEmailDB } from '@meAdmin/domain/entities/findAdmin/find_admin_by_email'
import { verifyPassword } from '@meAdmin/services/password/verify'

export const meAdminLogger: Middleware = (_httpRequest, httpBody) => {
  const { email, password } = httpBody

  const unValidatedAdmin = { email, password }

  const httpResponse = pipe(
    unValidatedAdmin,
    meAdminLoggerPropsValidate,
    E.mapLeft(error => clientError(error)),
    TE.fromEither,
    TE.chain(({ email, password }) => {
      return pipe(
        email,
        findAdminByEmailDB,
        TE.chain(admin => {
          return TE.tryCatch(
            async () => {
              if (!admin) {
                throw new Error('Oops! Email ou senha incorreto')
              }

              return admin
            },

            notFoundUserError => clientError(notFoundUserError as Error)
          )
        }),
        TE.chain(admin => {
          return TE.tryCatch(
            async () => {
              const result = await verifyPassword(password, admin.hash)

              if (!result) throw new Error('Oops! Senha incorreta')

              const token = await createAccessToken(admin)

              return ok({
                token
              })
            },
            (err) => clientError(err as Error)
          )
        })
      )
    })
  )

  return httpResponse
}
