function getUser(arr, value) {
  console.log(arr)
  for (let i = 0; i < arr.length; i++) {
    if(arr[i] !== value) return arr[i]
  }
}

export default getUser;