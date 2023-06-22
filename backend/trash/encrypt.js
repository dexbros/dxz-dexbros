/** @format */

var CryptoJS = require("crypto-js");

const encryptData = (data) => {
  var encryptedData = CryptoJS.AES.encrypt(
    data,
    process.env.ENCRYPTION_KEY
  ).toString();

  return encryptedData;
};

const decryptData = (data) => {
  var bytes = CryptoJS.AES.decrypt(data, process.env.ENCRYPTION_KEY);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedData;
};

module.exports = { encryptData, decryptData };
