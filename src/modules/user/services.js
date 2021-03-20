import {fetchAuthLoading, fetchLoading} from '../../common/fetch'
import {configs} from '../../configs'

export const loginService = ({code, password}) =>
  fetchLoading({
    url: `${configs.API}/Authentications/Login`,
    method: 'post',
    data: {
      code,
      password,
    },
  })

export const getStudentInfoService = (studentId) =>
  fetchAuthLoading({
    url:`${configs.API}/Authentications/Login`,
    method: 'get',
  })