/** @format */
export function chatLoggedUser(group, loggedUser) {
  console.log(group.user1);
  if (group.user1.handleUsername === loggedUser.handleUn) {
    return group.user2;
  } else {
    return group.user1;
  }
}
