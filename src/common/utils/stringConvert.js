export const priceParser = (number = 0) => {
  if (number === null) {
    return 0
  }
  return number.toString().replace(/(?=(\B\d{3})+(?!\d))/g, ',')
}

export default null
