/** @format */

const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { hash } = require("bcrypt");
const apiip = require("apiip.net")(process.env.IP_KEY);
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const { getAerospikeClient } = require("../aerospike");
const now = require("nano-time");
const { createFolder } = require("../helper/uploadImage");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ msg: "Invalid parameters" });
  } else {
    var search_tearm = req.body.username
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .join("");
    const user_id = now.micro();
    var client = await getAerospikeClient();
    var user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      req.body.username
    );

    // *** Check email already exists or not
    client
      .exists(user_key)
      .then(async (result) => {
        if (result) {
          return res.status(400).json({ msg: "Email has already been taken" });
        } else {
          // *** Hash user password
          const hash = await bcrypt.hash(password, 10);
          const user_bins = {
            u_id: user_id,
            email: email,
            password: hash,
            isVerified: false,
            log_un: "", // Log username
            handleUn: req.body.username, // handle username
            fn: "", // First name
            ln: "",
            p_i: "", // Profile image,
            coverPic: "", // Cover image
            p_bio: "", // profile details
            gndr: "", // Gender
            dob: "", // Date of birth
            s_t: search_tearm.slice(0, 2).toLowerCase(),
            s_t_u: search_tearm
              .replace(/[^a-zA-Z0-9 ]/g, "")
              .split(" ")
              .join("")
              .slice(0, 2)
              .toLowerCase(),
            toa: "normal", // Type of account
            c_p: Date.now(),
            flw_c: 0, // Following count
            flwr_c: 0, // Followers count
            u_status: 0,
            profile_like: 0,
            f_bin: ["flwr"],
          };
          var user_meta_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_USER_META,
            req.body.username
          );
          const user_meta_bins = {
            u_id: user_id,
            handleUn: req.body.username,
            flw: [], // Following list
            flwr: [], // Followers List
            own_grp: [], // Own block group
            mem_grp: [], // Memeber block group
            posts: [],
            mentions: [],
            earning: {},
            likes: [],
            dislikes: [],
            haha: [],
            love: [],
            u_visitors: [],
          };
          await client.put(user_key, user_bins);
          await client.put(user_meta_key, user_meta_bins);
          const user = await client.get(user_key);
          const token = jwt.sign({ data: user.bins }, "secret");

          // *** Save token in DB
          const ops = [Aerospike.operations.write("token", token)];
          const data = await client.operate(user_key, ops);

          // *** Folder create in google cloud
          const file = await createFolder(
            req.body.username.slice(0, 3),
            "profile"
          );
          try {
            return res.status(200).json({ user: { ...user.bins }, token });
          } catch (error) {
            return res.status(200).json({ msg: "Something went wrong" });
          }
        }
      })
      .catch((error) => {
        return res.status(400).json({ msg: error.message });
      });
  }
});

module.exports = router;
