import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { UserRefreshTokenPropsCodec } from '../../../domain/requiredFields/Users/refresh_token_props'
import { UserRefreshTokenPropsValidate } from '../contracts/Token/refresh_token_props_validate'
import { ValidationError } from '../errors/validation_error'
import { failure } from 'io-ts/PathReporter'

export const userRefreshTokenPropsValidate: UserRefreshTokenPropsValidate = (data) => {
  return pipe(
    E.tryCatch(
      () => {
        if (!data) throw new ValidationError('Refresh token invalido')

        return data
      },

      (err) => err as ValidationError
    ),
    E.chain(data => pipe(
      data,
      UserRefreshTokenPropsCodec.decode,
      E.mapLeft(errors => new ValidationError(failure(errors).join(', ') + ' invalido'))
    ))
  )
}