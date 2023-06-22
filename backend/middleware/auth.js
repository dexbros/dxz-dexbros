/** @format */

const jwt = require("jsonwebtoken");

module.exports = {
  requireLogin: (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    try {
      //console.log(req.headers.authorization);
      const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
      // console.log("Token ", token);
      if (!token) {
        throw new Error("Authentication failed!");
      }
      const decodedToken = jwt.verify(token, "secret");
      req.user = decodedToken.data;
      // console.log(req.user)
      next();
    } catch (err) {
      const error = new Error("Token Not Found!");
      return next(error);
    }
  },
};
