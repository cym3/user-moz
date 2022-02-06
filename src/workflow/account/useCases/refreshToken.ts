import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { UUID } from 'io-ts-types'
import { pipe } from 'fp-ts/lib/function'
import dayjs from 'dayjs'
import { Middleware } from '../../../core/infra/Middleware'
import { clientError } from '../../../core/infra/HttpErrorResponse'
import { ok } from '../../../core/infra/HttpSuccessResponse'
import { findRefreshTokenById } from '../domain/entities/findRefreshTokenById'
import { userRefreshTokenPropsValidate } from '../services/validate/refreshTokenProps'
import { createAccessToken } from '../services/token/createAccessToken'
import { createRefreshToken } from '../domain/entities/createRefreshToken'

export const refreshToken: Middleware = (_httpRequest, httpBody) => {
  const { id, userId } = httpBody

  const httpResponse = pipe(
    { id, userId },
    userRefreshTokenPropsValidate,
    E.mapLeft(error => clientError(new Error(error.message))),
    TE.fromEither,
    TE.chain(refreshTokenProps => {
      return pipe(
        refreshTokenProps.id,
        findRefreshTokenById,
        TE.chain(refreshToken => {
          return TE.tryCatch(
            async () => {
              if (!refreshToken) {
                throw new Error('Oops! Você não está autorizado')
              }

              return refreshToken
            },

            refreshTokenError => clientError(refreshTokenError as Error)
          )
        }),

        TE.chain(refreshToken => {
          const isExpiredDay = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn))

          if (!isExpiredDay) {
            return pipe(
              refreshToken.userId as UUID,
              createRefreshToken,
              TE.chain(newRefreshToken => pipe(
                newRefreshToken.userId as UUID,
                createRefreshToken,
                TE.map(newRefreshToken => {
                  const token = createAccessToken(newRefreshToken.userId as UUID)

                  return ok({
                    token,
                    refreshToken: newRefreshToken
                  })
                }
                ))
              ))
          }

          return pipe(
            userId as UUID,
            createRefreshToken,
            TE.map(refreshToken => {
              const token = createAccessToken(refreshToken.userId as UUID)

              return ok({
                token,
                refreshToken
              })
            })
          )
        })
      )
    })
  )

  return httpResponse
}
