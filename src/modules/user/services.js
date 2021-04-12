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

export const getEmployeesService = () =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/GetAllEmployees`,
    method: 'get',
  })

export const addEmployeesService = ({
  fullName,
  code,
  email,
  password,
  privateRole,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/CreateEmployee`,
    method: 'post',
    data: {
      fullName,
      code,
      email,
      password,
      privateRole,
    },
  })

export const updateEmployeesService = ({
  userCode,
  userRoleName,
  userEmail,
  oldPassword,
  newPassword,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/UpdateInformation`,
    method: 'post',
    data: {
      userCode,
      userRoleName,
      userEmail,
      oldPassword,
      newPassword,
    },
  })

export const blockUserService = ({ userId, roleName }) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/BlockUser`,
    method: 'put',
    data: {
      userId,
      roleName,
    },
  })

export const unblockUserService = ({ userId, roleName }) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/unblockUser`,
    method: 'put',
    data: {
      userId,
      roleName,
    },
  })

export const resetPasswordService = ({ userId, roleName }) =>
  fetchAuthLoading({
    url: `${configs.API}/Authentications/ResetPassword`,
    method: 'put',
    data: {
      userId,
      roleName,
    },
  })
