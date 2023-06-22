export function checkMention(str) {
var arr = str.split(" ");
var temp = [];
for(let i=0; i<arr.length; i++) {
	if(arr[i].includes('@')) {
    var word = arr[i].replace("@", "").replace("[", "").replace("]", "");
    return word;
  }
}
};

export function checkCryptoMention(str) {
var arr = str.split(" ");
var temp = [];
for(let i=0; i<arr.length; i++) {
	if(arr[i].includes('$')) {
    var word = arr[i].replace("$", "").replace("[", "").replace("]", "").replace("-", " ");
    // console.log(word)
    return word;
  }
}
};