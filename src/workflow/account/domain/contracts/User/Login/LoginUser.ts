import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { HttpErrorResponse } from '@core/infra/http_error_response'
import { ValidationError } from '@account/services/validate/errors/validation_error'
import { Email } from '@account/domain/requiredFields/email'
import { UserSchema, UserServicesSchema } from '@core/infra/prisma/schemas'
import { Password } from '@account/domain/requiredFields/password'
import { LoginUserProps } from '@account/domain/requiredFields/Users/login_user_props'
import { FindUserByEmailDB } from '@account/domain/contracts/User/FindUserByEmail'

interface User extends UserSchema {
  userServices: UserServicesSchema
}

interface UnValidatedUser {
  email: Email
  password: Password
}

interface ILoginUser {
  email: Email
  password: Password
}

export type LoginUserValidator = (user: UnValidatedUser) => E.Either<ValidationError, LoginUserProps>

export type LoginUserService = (findUserByEmailDB: FindUserByEmailDB) =>
(user: ILoginUser) => TE.TaskEither<HttpErrorResponse, User>
