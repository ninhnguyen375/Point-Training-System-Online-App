import { fetchAuthLoading, fetchLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const loginService = ({ code, password }) =>
  fetchLoading({
    url: `${configs.API}/Authentications/Login`,
    method: 'post',
    data: {
      code,
      password,
    },
  })

export const importStudentsService = (students) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/AddStudentsList`,
    method: 'post',
    data: students,
    pageLoading: true,
  })

export const getAllUsersService = () =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/GetAllUsers`,
    method: 'get',
  })
