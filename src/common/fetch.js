import axios from 'axios'
import nProgress from 'nprogress'
import {configs} from '../configs'
import {store} from './store'
import {MODULE_NAME as MODULE_USER} from '../modules/user/model'

export const fetchAuth = async ({
  url,
  headers,
  token,
  method,
  data,
  ...options
}) => {
  console.time(url)
  const tokenKey = token || store.getState()[MODULE_USER].profile.token

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

  console.timeEnd(url)

  return res
}

export const fetchAxios = async ({
  url,
  headers,
  method,
  data,
  ...options
}) => {
  console.time(url)
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

    console.timeEnd(url)
    return res
  } catch (err) {
    console.timeEnd(url)
    console.log('err in fetchAxios,', err)
    throw err
  }
}

export const fetchAuthLoading = async ({
  url,
  method,
  data,
  headers,
  token,
  pageLoading = false,
  ...options
}) => {
  console.time(url)
  if(pageLoading) {
    window.PageLoading.show()
  } else {
    nProgress.start()
  }

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

    if(pageLoading) {
      window.PageLoading.hide()
    } else {
      nProgress.done()
    }

    console.timeEnd(url)
    return res
  } catch (error) {
    if(pageLoading) {
      window.PageLoading.hide()
    } else {
      nProgress.done()
    }

    console.timeEnd(url)
    throw error
  }
}

export const fetchLoading = async ({
  url,
  method,
  data,
  headers,
  ...options
}) => {
  console.time(url)
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
    console.timeEnd(url)
    return res
  } catch (error) {
    nProgress.done()
    console.timeEnd(url)
    throw error
  }
}
