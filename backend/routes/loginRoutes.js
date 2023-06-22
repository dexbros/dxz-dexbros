/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const apiip = require("apiip.net")(process.env.IP_KEY);

const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const { getAerospikeClient } = require("../aerospike");

router.post("/", async (req, res, next) => {
  const client = await getAerospikeClient();
  if (!req.body.logUsername.trim() || !req.body.logPassword.trim()) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    console.log("Came here");
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
    const user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      req.body.logUsername
    );
    client.exists(user_key, (err, result) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      } else {
        if (!result) {
          return res
            .status(400)
            .json({ msg: "Invalid email or handle username" });
        } else {
          query.where(Aerospike.filter.equal("handleUn", req.body.logUsername));
          const queryPolicy = new Aerospike.QueryPolicy();
          const stream = query.foreach();
          var user_obj = null;
          stream.on("data", function (record) {
            console.log("Data >>> ", record.bins);
            user_obj = record.bins;
          });
          stream.on("data", function (record) {
            if (!user_obj) {
              return res.status(400).json({ msg: "Invalid username" });
            } else {
              bcrypt
                .compare(req.body.logPassword, user_obj.password)
                .then(async (result) => {
                  if (!result) {
                    console.log("Password is not correct");
                    return res
                      .status(400)
                      .json({ msg: "Password is not correct" });
                  } else {
                    const token = jwt.sign({ data: user_obj }, "secret");

                    // *** save token into DB
                    const ops = [Aerospike.operations.write("token", token)];
                    const data = await client.operate(user_key, ops);
                    try {
                      return res
                        .status(200)
                        .json({ msg: "User loggedIn", user: user_obj, token });
                    } catch (error) {
                      return res
                        .status(500)
                        .json({ msg: "Something went wrong" });
                    }
                  }
                })
                .catch((err) => {
                  return res.status(400).json({ msg: "Invalid password" });
                });
            }
          });
        }
      }
    });
  }
});

router.post("/report", async (req, res) => {
  const newReport = Report({
    _id: new mongoose.Types.ObjectId(),
    message: req.body.message,
  });
  await newReport.save();
});

module.exports = router;

// stream.on("error", function (error) {
//   return res.status(400).json({ msg: "Invalid email or handle username" });
// });
