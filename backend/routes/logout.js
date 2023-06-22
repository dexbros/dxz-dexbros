/** @format */

const express = require("express");
const router = express.Router();
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");
const fetch = require("node-fetch");
const { encryptData } = require("../trash/encrypt.js");

router.post("/", async (req, res, next) => {
  console.log(
    "USER LOGOUT...................................................................."
  );
  const client = await getAerospikeClient();
  // if(req.session){
  //     req.session.destroy(() => {
  //         res.redirect("/login");
  //     });
  // }
  const userId = req.user.handleUn;

  if (userId) {
    const user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      userId
    );

    const ops = [Aerospike.operations.write("token", 0)];
    const data = await client.operate(user_key, ops);
    return res.status(200).json({ msg: "User logged out" });

    const encrypt = encryptData(userId);
    console.log("Encrypt: ", encrypt);

    try {
      // const urls = [, `https://reels.websiteclubs.com/logout/`]
      const urls = [
        `https://reels.websiteclubs.com/logout/`,
        `https://sports.websiteclubs.com/logout`,
        `https://crypto.websiteclubs.com/logout`,
      ];

      for (let url in urls) {
        var requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            un: encrypt,
          }),
        };

        fetch(urls[url], requestOptions)
          .then((response) => response.json())
          .then((result) => {
            return res.status(200).json({ msg: "User logged out" });
          })
          .catch((error) => console.log("error", error));
      }
    } catch (error) {
      return res.status(501).json({ msg: error.message });
    }
  }
});

router.get("/", async (req, res) => {
  console.log("DONE");
});

module.exports = router;
