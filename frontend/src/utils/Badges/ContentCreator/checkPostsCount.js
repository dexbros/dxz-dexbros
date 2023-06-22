export const checkPostsCount = (user) => {
  if (user.flwr_c < Number(process.env.REACT_APP_POSTNO_FOR_CC)) {
    return false;
  } else if (user.post_c === Number(process.env.REACT_APP_POSTNO_FOR_CC)) {
    console.log("API Call")
  }
}