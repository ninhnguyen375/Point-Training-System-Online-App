import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const getStudentsOfClassByMonitorIdService = (monitorId, token) =>
  fetchAuthLoading({
    url: `${configs.API}/StudentClasses/GetStudentsInClass`,
    method: 'GET',
    token,
    params: {
      monitorId,
    },
  })

export const importStudentClassesService = (data) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/AddStudentClassesList`,
    method: 'post',
    data,
    pageLoading: true,
  })

export const getStudentClassListService = () =>
  fetchAuthLoading({
    url: `${configs.API}/StudentClasses/GetAllStudentClasses`,
    method: 'get',
  })
