import * as TE from 'fp-ts/lib/TaskEither'
import { fail } from '@core/infra/http_error_response'
import { prisma } from '@meAdmin/infra/prisma/client'
import { FindAdminByEmailDB } from '@meAdmin/domain/contracts/findAdmin/find_admin_by_email'

export const findAdminByEmailDB: FindAdminByEmailDB = (email) => {
  const Admin = TE.tryCatch(
    async () => {
      return await prisma.meAdmin.findUnique({
        where: { email }
      })
    },

    (err) => {
      console.log(err)
      return fail(new Error('Oops! Erro. Por favor contacte suporte'))
    }
  )

  return Admin
}
