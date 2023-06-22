/** @format */

require("dotenv").config();
const express = require("express");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Multer = require("multer");
// const exp = Aerospike.exp

// const uuid = require("uuid");
// const uuidv1 = uuid.v1;
const sharp = require("sharp");
const { Storage } = require("@google-cloud/storage");
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const maps = Aerospike.maps;
const { uuid } = require("uuidv4");
const { getAerospikeClient } = require("../../../aerospike");
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");
const e = require("express");

router.get("/fetch/crypto", async (req, res) => {
  const client = await getAerospikeClient();
  var query = client.query(
    process.env.CLUSTER_NAME,
    process.env.SET_CRYPTO_LIST
  );
  var stream = query.foreach();
  var arr = [];
  stream.on("data", async (data) => {
    arr.push(data.bins);
  });

  stream.on("end", async (data) => {
    return res.status(200).json(arr);
  });
});

module.exports = router;
