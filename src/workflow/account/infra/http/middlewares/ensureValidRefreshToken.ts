import { verify } from 'jsonwebtoken'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '../../../../../core/infra/Middleware'
import { forbidden } from '../../../../../core/infra/HttpErrorResponse'
import { ok } from '../../../../../core/infra/HttpSuccessResponse'

type DecodedRefreshJwt = {
  sub: string
  id: string
}

export const ensureValidRefreshTokenMiddleware: Middleware = (httpRequest, httpBody) => {
  const bearerHeader = httpRequest.headers.authorization

  const httpResponse = pipe(
    E.tryCatch(
      () => {
        if (!bearerHeader) throw new Error('Oops! Você não está autorizado')

        const refreshAccessToken = bearerHeader.split(' ')[1]

        if (!refreshAccessToken) throw new Error('Oops! Você não está autorizado')

        return refreshAccessToken
      },
      (err) => forbidden(err as Error)
    ),
    E.chain(refreshAccessToken => {
      return E.tryCatch(
        () => {
          const { sub, id } = verify(refreshAccessToken, process.env.REFRESH_TOKEN_SECRET!) as DecodedRefreshJwt

          return ok({ ...httpBody, userId: sub, id: id })
        },
        (_err) => forbidden(new Error('Oops! Você não está autorizado'))
      )
    }),
    TE.fromEither
  )

  return httpResponse
}
