import axios from 'axios'
import nProgress from 'nprogress'
import { configs } from '../configs'
import { store } from './store'
import { MODULE_NAME as MODULE_USER } from '../modules/user/model'

export const fetchAuth = ({ url, headers, ...options }) => axios({
  url,
  timeout: configs.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  ...options,
})

export const fetchAuthLoading = async ({ url, method, data, headers, token, ...options }) => {
  nProgress.start()
  const tokenKey = token || store.getState()[MODULE_USER].profile.token

  try {
    const res = await axios({
      url,
      method,
      data,
      timeout: configs.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenKey}`,
        ...headers,
      },
      ...options,
    })

    nProgress.done()
    return res
  } catch (error) {
    nProgress.done()
    throw error
  }
}

export const fetchLoading = async ({ url, method, data, headers, ...options }) => {
  nProgress.start()

  try {
    const res = await axios({
      url,
      method,
      data,
      timeout: configs.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...options,
    })

    nProgress.done()
    return res
  } catch (error) {
    nProgress.done()
    throw error
  }
}