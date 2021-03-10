import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs/dev'

export const services = {
  login: ({ code, password }) =>
    fetchAuthLoading({
      url: `${configs.API}/Authentications/Login`,
      method: 'post',
      data: {
        code,
        password,
      },
    }),
}
