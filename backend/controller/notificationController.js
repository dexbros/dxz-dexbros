/** @format */

require("dotenv").config();
const router = require("express").Router();
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");

class NotificatonController {
  constructor() {}

  async fetchAllNotification(req, res) {
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_APP_HISTORY,
      req.user.handleUn
    );

    const client = await getAerospikeClient();
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_APP_HISTORY
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("n_id", req.user.handleUn));
    query.select("notification"); //select single bin
    const stream = query.foreach();
    let arr = [];

    let noti_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_APP_HISTORY,
      req.user.handleUn
    );
    const ops = [Aerospike.operations.write("count", 0)];

    stream.on("data", async function (record) {
      // arr.push(record.bins.notification);
      for (let key in record.bins.notification) {
        arr.push(record.bins.notification[key]);
      }
    });

    stream.on("end", async function () {
      const data = await client.operate(noti_key, ops);
      var page = req.query.page || 1;
      var limit = req.query.limit || 5;
      var start = (page - 1) * limit;
      var end = page * limit;
      var temp = arr.slice(start, end);
      return res.status(200).json(temp);
    });
  }

  async markNotificationAsView(req, res) {
    console.log(typeof req.params.id);
    const id = req.params.id;
    const client = await getAerospikeClient();
    if (!id) {
      return res.status(400).json({ msg: "Invalid id" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        req.user.handleUn
      );
      console.log(id);
      const ops = [
        Aerospike.maps
          .getByKey("notification", Number(id))
          .andReturn(Aerospike.maps.returnType.VALUE),
      ];

      client.operate(key, ops, async (err, result) => {
        // console.log(result.bins.notification);
        // result.bins.notification.vi = 2;

        // const map_ops = [
        //   Aerospike.operations.write("n_id", req.user.handleUn),
        //   Aerospike.maps.put("notification", id, result.bins.notification, {
        //     order: Aerospike.maps.order.KEY_ORDERED,
        //   }),
        // ];
        // let data = await client.operate(key, map_ops);
        return res.status(200).json({ msg: "Viewed notification" });
      });
    }
  }

  async fetchNotificationCount(req, res) {
    const client = await getAerospikeClient();
    var query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_APP_HISTORY
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select("count"); //select single bin
    query.where(Aerospike.filter.equal("n_id", req.user.handleUn));
    const stream = query.foreach();
    var count = 0;

    stream.on("data", async (data) => {
      console.log(data);
      count = data.bins.count;
    });

    stream.on("end", function (data) {
      return res.status(200).json(count);
    });
  }
}

module.exports = new NotificatonController();
