
export function checkContentCreator(user, label) {
  console.log(user)
  const followerCount = user.flwr_c;
  const post_count = user.post_c;

  // **** Content creator
  if (followerCount >=1 || followerCount < 2) {
    console.log("Content creator")
    
  } else if (post_count >= 2) {
    console.log("Post completed")
    label = true;
  }
}

