const checkProfile = (user) => {
  console.log(user);
  console.log(user.flwr_c)
  const flwr_count = user.flwr_c;

  // ** CELB USER
  if (flwr_count > 0 && flwr_count <= 1) {
    // return("Celb, MdVerified")
  }
  // ** BURNER USER
  else if (flwr_count >= 2 && flwr_count <= 3) {
    return("burner, GiBurningEye");
  }
  // ** 
  else if (flwr_count >=4 && flwr_count <=5) {
    return("burner");
  } else {
    console.log("Normal user, GiMiner")
  }
} 


export function callAPI() {
  console.log("")
}
export default checkProfile; 
