function checkForWarning(like, dislike, repost, booked) {
  const engagement = like + dislike + repost + booked;
  if (dislike > 0) {
    return (Math.floor(engagement/dislike))
  }
}
export default checkForWarning;