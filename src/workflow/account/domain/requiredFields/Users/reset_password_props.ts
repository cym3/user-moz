import * as t from 'io-ts'
import { UUID } from 'io-ts-types'
import { PasswordCodec } from '@account/domain/requiredFields/password'

export const ResetPasswordPropsCodec = t.type({
  userId: UUID,
  password: PasswordCodec
})

export type ResetPasswordProps = t.TypeOf<typeof ResetPasswordPropsCodec>
