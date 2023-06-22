const calulatePercentage = (helpful, unhelpful) => {
  var calculate = (unhelpful / (helpful + unhelpful)) * 100;
  return Math.round(calculate)
}
export default calulatePercentage