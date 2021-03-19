import {fetchLoading} from '../../common/fetch'
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
