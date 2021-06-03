import { configs } from '../../configs'

/* eslint-disable no-console */
export default (err, form, noti) => {
  if (!err) {
    return
  }

  if (!noti) {
    console.log('[✔] Debug: noti', noti)
    return
  }
  const status = err.response ? err.response.status : undefined

  if (status === 404) {
    noti.error({ message: 'Dịch vụ không khả dụng' })
    return
  }

  if (status === 500) {
    noti.error({ message: 'Lỗi Hệ Thống', description: 'Dịch vụ API' })
    return
  }

  // if (status === 401) {
  //   noti.error({ message: 'You do not have permission' })
  //   return
  // }

  const data = err.response ? err.response.data : undefined
  // console.log('data', data)
  const isOnFormError = !!form

  if (!data) {
    if (err.message === `timeout of ${configs.TIMEOUT}ms exceeded`) {
      noti.error({ message: 'Lỗi Hệ Thống', description: 'Dịch vụ API' })
      return
    }

    noti.error({ message: err.message || 'Lỗi Hệ Thống' })
    return
  }

  const errors = data.message ? data.message : data

  if (typeof errors === 'string') {
    if (!errors) {
      return
    }
    noti.error({ message: 'Lỗi', description: errors })
    return
  }

  Object.keys(errors).forEach((key) => {
    if (isOnFormError) {
      if (form.getFieldValue(key) === undefined) {
        noti.error({
          message: Array.isArray(errors[key]) ? errors[key][0] : errors[key],
        })
      } else {
        form.setFields([
          {
            name: key[0].toLowerCase() + key.substring(1),
            errors: Array.isArray(errors[key]) ? errors[key] : [errors[key]],
            value: form.getFieldValue(key),
          },
        ])
      }
    } else if (key.toLowerCase() !== 'success') {
      noti.error({
        message: Array.isArray(errors[key]) ? errors[key][0] : errors[key],
      })
    }
  })
}
