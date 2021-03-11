export const mapPayloadToForm = (payload, files, fieldFileName) => {
  const form = new FormData()
  const data = { ...payload }

  Object.keys(data).forEach((key) => {
    const value = data[key]
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] === 'object') {
          Object.keys(value[i]).forEach((k) => {
            form.append(`${key}[${i}][${k}]`, value[i][k])
          })
        } else {
          form.append(`${key}[${i}]`, value[i])
        }
      }
    } else if (value !== undefined && value !== null && value !== '') {
      form.append(key, data[key])
    }
  })

  if (Array.isArray(files)) {
    files.forEach((file) => {
      if (file) {
        form.append(fieldFileName, file.originFileObj || file, file.name)
      }
    })
  }

  return form
}

export const mapParamsToUrl = (obj) => {
  let url = ''
  Object.keys(obj).forEach((k) => {
    if (!Array.isArray(obj[k]) || typeof obj[k] !== 'object') {
      url += `${k}=${obj[k]}&`
    } else if (Array.isArray(obj[k])) {
      obj[k].forEach((x, i) => {
        url += `${k}[${i}]=${x}&`
      })
    } else if (typeof obj[k] === 'object') {
      obj[k].forEach((x, i) => {
        url += `${k}[${i}]=${x}&`
      })
    }
  })

  return `?${url}`
}

export default null
