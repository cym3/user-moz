import { UserSchema } from '../../../infra/prisma/schemas'
import * as TE from 'fp-ts/TaskEither'
import { UUID } from 'io-ts-types'
import { HttpErrorResponse } from '../../../../../core/infra/http_error_response'
import { Tag } from '../../requiredFields/tag'

interface IAddUserToTags {
  userId: UUID
  tags: Tag[]
}

export type AddUserToTagsDB = (props: IAddUserToTags) => TE.TaskEither<HttpErrorResponse, UserSchema>