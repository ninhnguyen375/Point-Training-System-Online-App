import axios from 'axios'
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
    return res
  } catch (error) {
    return error
  }
}