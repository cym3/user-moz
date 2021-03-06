import { Router } from 'express'
import { meAdminLoggerController } from '@meAdmin/infra/http/controller/login/login_meadmin'
import { meAdminRegisterController } from '@meAdmin/infra/http/controller/createMeAdmin/create_meadmin'
import { tagCreatorController } from '@meAdmin/infra/http/controller/tags/create_tags'

const MeAdminRouter = Router()

MeAdminRouter.post('/create', meAdminRegisterController)
MeAdminRouter.post('/create_tag', tagCreatorController)
MeAdminRouter.post('/login', meAdminLoggerController)

export default MeAdminRouter
