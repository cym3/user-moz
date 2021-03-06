import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { HttpErrorResponse } from '@core/infra/http_error_response'
import { ValidationError } from '@account/services/validate/errors/validation_error'
import { TagsProps } from '@account/domain/requiredFields/Users/tags_props'
import { Tag } from '@account/domain/requiredFields/tag'
import { FindUserByIdDB } from '@account/domain/contracts/User/FindUserById'
import { UserSchema, UserServicesSchema } from '@core/infra/prisma/schemas'
import { UUID } from 'io-ts-types'

interface UnValidatedUser {
  userId: string
  tags: {
    id: string
    title: string
  }[]
}

interface User extends UserSchema {
  userServices: UserServicesSchema
}

interface IAddUserToTagsDB {
  userId: UUID
  tags: Tag[]
}

interface OutputAddUserToTags {
  user: User
  tags: Tag[]
}

export type AddUserToTagsValidator = (data: UnValidatedUser) => E.Either<ValidationError, TagsProps>

export type AddUserToTagsDB = (user: IAddUserToTagsDB) => Promise<IAddUserToTagsDB>

export type AddUserToTagsService = (addUserToTagsDB: AddUserToTagsDB) => (findUserByIdDB: FindUserByIdDB) =>
(user: TagsProps) => TE.TaskEither<HttpErrorResponse, OutputAddUserToTags>
