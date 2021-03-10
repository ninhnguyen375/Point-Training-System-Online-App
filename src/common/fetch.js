import axios from 'axios'
import nProgress from 'nprogress'
import { configs } from '../configs/dev'

export const fetchAuth = ({ url, headers, ...options }) => axios({
  url,
  timeout: configs.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    ...headers,
  },
  options,
})

export const fetchAuthLoading = async ({ url, method, data, headers, ...options }) => {
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
      options,
    })

    // nProgress.done()
    return res
  } catch (error) {
    nProgress.done()
    return error
  }

}