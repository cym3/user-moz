import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '../../../../core/infra/middleware'
import { clientError, fail } from '../../../../core/infra/http_error_response'
import { ok } from '../../../../core/infra/http_success_response'
import { createAccessToken } from '../../services/token/create_access_token'
import { userRegisterPropsValidate } from '../../services/validate/createUser/register_user_props'
import { createUserDB } from '../../domain/entities/createUser/create_user'
import { hashPassword } from '../../services/password/hash'
import { createRefreshTokenDB } from '../../domain/entities/token/create_refresh_token'
import { UUID } from 'io-ts-types'
import { createRefreshAccessToken } from '../../services/token/create_refresh_access_token'

export const userRegister: Middleware = (_httpRequest, httpBody) => {
  const { name, email, password } = httpBody

  const unValidatedUser = { name, email, password }

  const httpResponse = pipe(
    unValidatedUser,
    userRegisterPropsValidate,
    E.mapLeft(error => clientError(error)),
    TE.fromEither,
    TE.chain(validUser => {
      return pipe(
        TE.tryCatch(
          async () => {
            const { name, email, password } = validUser
            const hash = await hashPassword(password)

            return { name, email, hash }
          },

          (err) => {
            console.log(err)
            return fail(new Error('Oops! A sua senha não foi criada. Por favor contacte suporte'))
          }
        ),
        TE.chain(user => {
          return pipe(
            user,
            createUserDB,
            TE.chain(user => {
              return pipe(
                user.id as UUID,
                createRefreshTokenDB,
                TE.map(refreshToken => {
                  return {
                    user,
                    refreshToken
                  }
                })
              )
            }),
            TE.map(({ user, refreshToken }) => {
              const token = createAccessToken(user)

              const refreshAccessToken = createRefreshAccessToken(refreshToken)

              return ok({
                name: user.name,
                token,
                refreshToken: refreshAccessToken
              })
            })
          )
        })
      )
    })
  )

  return httpResponse
}
