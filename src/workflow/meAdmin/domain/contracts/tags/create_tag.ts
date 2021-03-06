import * as TE from 'fp-ts/TaskEither'
import { HttpErrorResponse } from '@core/infra/http_error_response'
import { TagSchema } from '@meAdmin/infra/prisma/schemas'
import { Tag } from '@meAdmin/domain/requiredFields/tag'

export type CreateTagDB = (tag: Tag) => TE.TaskEither<HttpErrorResponse, TagSchema>
