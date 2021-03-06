import { ServiceSchema } from '@core/infra/prisma/schemas'

export const services: ServiceSchema = {
  api: 'API',
  webDownload: 'WEB_DOWNLOAD'
}

export const accountTypes = {
  unipersonal: 'UNIPERSONAL',
  employee: 'EMPLOYEE',
  business: 'BUSINESS',
  student: 'STUDENT'
}
