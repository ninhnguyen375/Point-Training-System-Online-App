export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj))
export const getString = (obj, path) => {
  try {
    let res = obj
    path.split('.').forEach((p) => {
      res = res[p]
    })

    return res
  } catch (error) {
    return ''
  }
}
