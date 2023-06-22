/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Aerospike = require("aerospike");
const { defineAerospikeClient, getAerospikeClient } = require("../aerospike");
const batchType = Aerospike.batchType;
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 7001;

function getEmojiData() {
  fs.readFile("emoji.json", "utf-8", async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let batchPolicy = new Aerospike.BatchPolicy({});
      var batchRecords = [];
      const client = await getAerospikeClient();
      let arr = JSON.parse(data);

      for (let i = 0; i < 250; i++) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: new Aerospike.Key("test", "emoji_data", uuidv4()),
          ops: [
            Aerospike.operations.write("emoji", arr[i].emoji),
            Aerospike.operations.write("description", arr[i].description),
          ],
        });
        await client.batchWrite(batchRecords, batchPolicy);
        try {
          // console.log("Emoji saved...");
        } catch (error) {
          console.log(error.message);
        }
      }
      console.log("Emoji saved...");
    }
  });
}

app.listen(port, async () => {
  console.log("Crypto API port running on " + port);
  const config = await getAerospikeClient();
  getEmojiData();
});
