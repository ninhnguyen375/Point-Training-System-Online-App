import { notification } from 'antd'

export const replaceValue = ''

/**
 *
 * @param {*} data Object to init data if it null
 * @returns Object has init data
 */
export const initDataForObject = (data) => {
  if (!data) throw new Error('Please put data')

  try {
    const temp = {}
    Object.keys(data).forEach((key) => {
      temp[key] = data[key] ? data[key] : replaceValue
    })
    return temp
  } catch (error) {
    console.log(error)
    notification.error({
      message: 'Check console',
    })
  }
}

export default null
