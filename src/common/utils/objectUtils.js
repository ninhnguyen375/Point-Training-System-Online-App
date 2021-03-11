import { ENDPOINTS } from '../../modules/product/models'

export const getValueByKey = (obj = {}, key) => {
  if (!obj) return null

  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key]
  }

  for (let i = 0; i < Object.keys(obj).length; i += 1) {
    const k = Object.keys(obj)[i]
    if (typeof obj[k] === 'object') {
      const value = getValueByKey(obj[k], key)
      if (!!value || value === 0) {
        return value
      }
    }
  }

  return null
}

export const getValueByPath = (obj = {}, path = '') => {
  if (!obj) return undefined
  const keys = path.split('.')
  if (!keys[1]) {
    return obj[keys[0]]
  }

  if (obj[keys[0]] && typeof obj[keys[0]] === 'object') {
    const value = getValueByPath(
      obj[keys[0]],
      keys.splice(1, keys.length).join('.'),
    )
    if (!!value || value === 0) {
      return value
    }
  }

  return undefined
}

export const getDefaultImageUrl = (
  arr = [],
  isSecond,
  imageHosting = ENDPOINTS.imageUrl,
) => {
  const defaultImage = arr.find((image) => image.isProductAvatar)
  const isNotDefaultImage = arr.find((image) => !image.isProductAvatar)
  const host = imageHosting || ''
  const hoveredImage = arr.find(
    (image) => !image.isProductAvatar && image.id !== isNotDefaultImage.id,
  )

  if (arr.length === 0) {
    return 'https://www.pngitem.com/pimgs/m/557-5570897_box-free-vector-icon-designed-by-pixel-buddha.png'
  }

  if (!defaultImage && isSecond) {
    return host + (hoveredImage ? hoveredImage.id : '')
  }

  if (!defaultImage) {
    return host + (isNotDefaultImage ? isNotDefaultImage.id : '')
  }

  if (isSecond && isNotDefaultImage) {
    return host + (isNotDefaultImage ? isNotDefaultImage.id : '')
  }

  return host + (defaultImage ? defaultImage.id : '')
}

export const removeEmptyValueKey = (obj = {}) => {
  const data = { ...obj }
  Object.keys(data).forEach((key) => {
    const value = data[key]

    // empty value
    if (!value && value !== 0) {
      delete data[key]
    }
    // empty editor text
    if (value && value === '<p></p>') {
      delete data[key]
    }
    // empty obj
    if (
      value
      && typeof value === 'object'
      && !Array.isArray(value)
      && Object.keys(removeEmptyValueKey(value)).length === 0
    ) {
      delete data[key]
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      data[key] = removeEmptyValueKey(data[key])
    }
  })
  return data
}

export const mapSearchStringToObj = (str = '?') => {
  const searchString = decodeURI(str.split('?')[1])
  if (!searchString) return undefined

  let queries = searchString.split('&')
  queries = queries.map((q) => q.split('='))
  return removeEmptyValueKey(Object.fromEntries(queries))
}

export const mapObjToSearchString = (obj = {}) => encodeURI(
  `?${Object.entries(removeEmptyValueKey(obj))
    .map((x) => x.join('='))
    .join('&')}`,
)

export const isEmptyObj = (obj = {}) => Object.keys(removeEmptyValueKey(obj)).length === 0
