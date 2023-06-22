/** @format */

const express = require("express");
const router = express.Router();
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");

router.get("/:username", async (req, res, next) => {
  console.log(req.params);
  var payload = await getPayload(req.params.username);

  res.status(200).json(payload);
});

async function getPayload(username) {
  var user = await User.findOne({ handleUn: username });

  if (user == null) {
    // handleUn
    user = await User.findById(username)
      .populate({
        path: "bookedPost",
        populate: { path: "comments", model: "PostComment" },
      })
      .populate({
        path: "bookedPost",
        populate: { path: "postedBy", model: "User" },
      })
      .populate("hide")
      .populate(process.env.SET_BLOCKCAST);
    if (user == null) {
      return {
        errorMessage: "User Not Found",
      };
    }
  }

  return {
    profileUser: user,
  };
}

router.get("/fetch/:handleUn", async (req, res) => {
  const client = await getAerospikeClient();
  console.log("HERE CAME")
  if (!req.params) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
    const user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      req.params.handleUn
    );

    client.exists(user_key, async (err, result) => {
      if (err) {
        return res.status(401).json({ msg: err.message });
      } else {
        if (!result) {
          return res.status(400).json({ msg: "No user found" });
        } else {
          query.where(Aerospike.filter.equal("handleUn", req.params.handleUn));
          const queryPolicy = new Aerospike.QueryPolicy();
          const stream = query.foreach();
          var user_obj = null;
          stream.on("data", function (record) {
            // console.log(record.bins)
            user_obj = record.bins;
          });

          stream.on("end", function (record) {
            // return res.status(200).json(user_obj)
            var query1 = client.query(
              process.env.CLUSTER_NAME,
              process.env.SET_USER_META
            );
            query1.select(["flwr", "flw"]);
            query1.where(
              Aerospike.filter.equal("handleUn", req.params.handleUn)
            );
            const stream1 = query1.foreach();

            stream1.on("data", function (record) {
              user_obj = { ...user_obj, ...record.bins };
            });

            stream1.on("end", function (record) {
              console.log(user_obj);
              return res.status(200).json(user_obj);
            });
          });
        }
      }
    });
  }
});

module.exports = router;
