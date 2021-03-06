import { GetStudentInfoByUserIdDB } from '@account/domain/contracts/User/UserInfo/CreateStudentInfo'
import { prisma } from '@core/infra/prisma/client'

export const getStudentInfoByUserIdDB: GetStudentInfoByUserIdDB = async (userId) => {
  const student = await prisma.student.findUnique({
    where: { userId }
  })

  return student
}
