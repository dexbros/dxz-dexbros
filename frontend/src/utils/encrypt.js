/** @format */

import CryptoJS from "crypto-js";

export const encryptData = (data) => {
  var encryptedData = CryptoJS.AES.encrypt(
    data,
    process.env.REACT_APP_ENCRYPTION_KEY
  ).toString();

  return encryptedData;
};

export const decryptData = (data) => {
  var bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  return decryptedData;
};
