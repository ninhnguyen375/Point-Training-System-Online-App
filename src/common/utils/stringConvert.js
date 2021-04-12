export const priceParser = (number = 0) => {
  if (!number) {
    return 0
  }

  return number.toString().replace(/(?=(\B\d{3})+(?!\d))/g, ',')
}

export const rawString = (str = '') => str.trim().toLowerCase()
