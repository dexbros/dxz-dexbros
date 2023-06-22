export const checkFollowersCount = (user) => {
  if (!user.flwr_c) {
    return false;
  } else {
    if (user.flwr_c < Number(process.env.REACT_APP_CC_FLWR_COUNT_FOR_CC)) {
      return false;
    } else if (user.flwr_c === Number(process.env.REACT_APP_CC_FLWR_COUNT_FOR_CC)) {
      console.log("API Call")
    }
  }
};