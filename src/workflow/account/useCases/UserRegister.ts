import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { findOrSaveUser } from '../domain/entities/findOrSaveOauthUser'
import { pipe } from 'fp-ts/lib/function'
import { Middleware } from '../../../core/infra/Middleware'
import { UserLoggerByOauthPropsValidate } from '../services/validate/UserLoggerByOauthPropsValidate'
import { clientError } from '../../../core/infra/HttpErrorResponse'
import { ok } from '../../../core/infra/HttpSuccessResponse'
import { createAccessToken } from '../infra/http/OAuth/create_id_token'
import { userRegisterPropsValidate } from '../services/validate/userRegisterPropsValidate'
import { userSaver } from '../domain/entities/userSaver'
import { hashPassword } from '../services/password/hash'
import { fail } from 'assert'



export const userRegister: Middleware = (_httpRequest, httpBody) => {
  const {name, email, password} = httpBody

  const unValidatedUser = {name, email, password}

  const httpResponse = pipe(
    unValidatedUser,
    userRegisterPropsValidate,
    E.mapLeft(error => clientError(new Error(error.message))),
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
            console.log(err);
            return fail(new Error('Oops! A sua senha não foi criada. Por favor contacte suporte'))
          }
        ),
        TE.chain(user => {
          return pipe(
            user,
            userSaver,
            TE.map(newUser => {
              
              const token = createAccessToken(newUser)

              return ok({ 
                name: newUser.name,
                token
              })
            })
          )
        })
      )
    })
  )

  return httpResponse
}