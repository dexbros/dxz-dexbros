
export function checkFollowersCount(user) {
  console.log(user)
  const followerCount = user.flwr_c;
  const post_count = user.post_c;

  // **** Content creator
  if ((followerCount >=1 || followerCount < 2) && (post_count >= 2)) {
    console.log("Content creator")
  }
  else if (followerCount>=2 || followerCount < 3) {
    console.log("Miner")
  } else {
    console.log("Burner")
  }
}

