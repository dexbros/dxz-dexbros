export const getPercentager = (numerator, denominator) => {
  // console.log("numerator ", numerator);
  if (numerator > 0) {
  return (numerator/denominator)*100
  } else {
    return 0
  }
}