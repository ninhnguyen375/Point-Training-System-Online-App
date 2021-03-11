import moment from 'moment'

/**
 *
 * @param {Array} arr
 * @param {String} field
 * @param {'asc' | 'desc'} type Default is "asc"
 */
export const sortByDate = (arr = [], field, type = 'asc') => arr.sort((a, b) => {
  if (type === 'asc') {
    if (moment(a[field]).isBefore(b[field])) {
      return -1
    }
  } else if (moment(b[field]).isBefore(a[field])) {
    return -1
  }
  return 0
})

export default null
