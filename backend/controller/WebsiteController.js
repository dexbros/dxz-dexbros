/** @format */

const Aerospike = require("aerospike");
// const { defineAerospikeClient, getAerospikeClient } = require("./aerospike");
const axios = require("axios");
const batchType = Aerospike.batchType;

class WebsiteController {
  constructor() {}

  async getUserForOtherWebsite(data) {
    return new Promise(async (resolve, reject) => {
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);

      query.where(Aerospike.filter.equal("handleUn", data));
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      var user_obj = null;
      stream.on("data", function (record) {
        // console.log(record.bins)
        user_obj = record.bins;
      });

      stream.on("end", function (record) {
        return res.status(200).json(user_obj);
      });
    });
  }
}

module.exports = new WebsiteController();
