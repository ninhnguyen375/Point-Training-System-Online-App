export default null

export const areEqualNumbers = (...numbers) => {
  for (let i = 0; i < numbers.length; i += 1) {
    if (parseFloat(numbers[i]) !== parseFloat(numbers[0])) {
      return false
    }
  }
  return true
}
