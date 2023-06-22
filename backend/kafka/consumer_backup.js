const { Kafka } = require("kafkajs");
const Chance = require("chance");
const fetch = require("node-fetch");
const { getAerospikeClient } = require("../aerospike");
const Aerospike = require("aerospike");
// const conn = require('./mysql.js');
const dotenv = require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const chance = new Chance();
const producer = require("./producerK");
// const { connectSocket } = require("./Socket.js");
const server = require("../app.js");

// const kafka = new Kafka({
//   clientId: 'my-consumer',
//   brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
// })

//'34.106.49.135:9092'

const kafka = new Kafka({
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: chance.character() });
//const topic = 'newSlips';

// "KafkaJS v2.0.0 switched default partitioner. To retain the same partitioning behavior as in previous versions, create the producer with the option \"createPartitioner: Partitioners.LegacyPartitioner\"

const run = async () => {
  const aeroClient = await getAerospikeClient();

  // Producing
  await consumer.connect();
  console.log("Consumer connected successfully...........");
  await consumer.subscribe({
    topics: [
      "aerospike",
      "contestResult",
      "updateContestResult",
      "newSlips",
      "shiftSlipsToHistory",
      "wallet",
      "transaction",
    ],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic === 'posts_room') {
        var data = JSON.parse(message.value.toString());
        console.log("*** Consumer ***");
        console.log(data)
      }
    },
  });
};

const transactionUpdater = async (result) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  var socket = connectSocket();
  if(result.mth == "deposit"){
    fetch(
      `https://axmpb0785e.dexbros.com/api/index/p2p/list?type=${result.tp}&id=${result.tid}&limit=1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        var copy = {
          result : data,
          type : "deposit"
        }
        socket.to(result.id).emit("update transaction",copy);
        batchUpload(data,process.env.DEPOSIT)
      })
      .catch((error) => console.log("error", error));
  }else if(result.mth == "withdraw"){
    fetch(
      `https://axmpb0785e.dexbros.com/api/index/p2p/list?type=${result.tp}&id=${result.tid}&limit=2`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        var copy = {
          result : data,
          type : "withdraw"
        }
        // console.log(data)
        socket.to(result.id).emit("update transaction",copy);
        batchUpload(data,process.env.WITHDRAW)
      })
      .catch((error) => console.log("error", error));
  }else{
    fetch(
      `https://axmpb0785e.dexbros.com/api/index/p2p/list?type=${result.tp}&id=${result.tid}&limit=3`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        var copy = {
          result : data,
          type : "withdraw"
        }
        socket.to(result.id).emit("update transaction",copy);
        batchUpload(data,process.env.TRANSFER)
      })
      .catch((error) => console.log("error", error));
  }
}

const walletUpdater = async (result) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  var socket = connectSocket();
  if (socket) {
    if (result.msg === "ub") {
      fetch(
        `https://axmpb0785e.dexbros.com/api/index/p2p/list?type=cwallet&id=${result.id}&limit=1`,
        //https://axmpb0785e.dexbros.com/api/index/p2p/list?type=cwallet&id=100000000000000000100002&limit=1
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
            socket.to(result.id).emit('request for update', data)
            batchUpload2(data,`${process.env.USER_WALLET}`)
        })
        .catch((error) => console.log("error", error));
    }
  }
};

const shiftSlipsToHistory = async (contestId, aeroClient) => {
  var slipQuery = aeroClient.query(process.env.CLUSTER_NAME, "allSlips");

  slipQuery.where(Aerospike.filter.equal("cId", contestId));

  slipQuery.select("_id");

  var slipStream = slipQuery.foreach();
  var allSlipIds = [];
  slipStream.on("data", (rec) => {
    allSlipIds.push({
      key: new Aerospike.Key(process.env.CLUSTER_NAME, "allSlips", rec.bins._id.toString()),
      readAllBins: true,
    });
  });

  slipStream.on("error", (err) => {
    console.log(err);
  });

  slipStream.on("end", () => {
    var itemCount = 1000;
    for (var i = 0; i < allSlipIds.length; i++) {
      var itemStart = i * itemCount;
      var itemEnd = (i + 1) * itemCount;
      var keys = allSlipIds.slice(itemStart, itemEnd);
      if (keys.length > 0) {
        var readPolicy = new Aerospike.ReadPolicy({
          totalTimeout: 50000,
          socketTimeout: 50000,
          maxRetries: 2,
        });
        aeroClient.batchRead(keys, readPolicy, async function (error, results) {
          if (error) {
            console.log("ERROR - %s", error.message);
          } else {
            var allResults = results;
            //console.log("results:",results);
            const batchType = Aerospike.batchType;
            var batchSize = 300;
            var policy = new Aerospike.WritePolicy({
              totalTimeout: 50000,
              socketTimeout: 50000,
              maxRetries: 5,
            });

            for (let batch = 0; batch < allResults.length; batch += batchSize) {
              var batchRecords = [];
              var batchRecords2 = [];

              for (
                let x = 0;
                x < batchSize && x + batch < allResults.length;
                x++
              ) {
                var currentMonth = new Date(
                  allResults[batch + x].record.bins.gSD
                ).getMonth();
                var currentYear = new Date(
                  allResults[batch + x].record.bins.gSD
                ).getFullYear();
                var setName = `allHistorySlips-${currentMonth}${currentYear}`;
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    setName,
                    allResults[batch + x].record.bins._id.toString()
                  ),
                  ops: [
                    Aerospike.operations.write(
                      "_id",
                      allResults[batch + x].record.bins._id
                    ),
                    Aerospike.operations.write(
                      "spAS",
                      allResults[batch + x].record.bins.spAS
                    ),
                    Aerospike.operations.write(
                      "cId",
                      allResults[batch + x].record.bins.cId
                    ),
                    Aerospike.operations.write(
                      "cN",
                      allResults[batch + x].record.bins.cN
                    ),
                    Aerospike.operations.write(
                      "gN",
                      allResults[batch + x].record.bins.gN
                    ),
                    Aerospike.operations.write(
                      "sN",
                      allResults[batch + x].record.bins.sN
                    ),
                    Aerospike.operations.write(
                      "gSD",
                      allResults[batch + x].record.bins.gSD
                    ),
                    Aerospike.operations.write(
                      "dT",
                      allResults[batch + x].record.bins.dT
                    ),
                    Aerospike.operations.write(
                      "cc",
                      allResults[batch + x].record.bins.cc
                    ),
                    Aerospike.operations.write(
                      "uId",
                      allResults[batch + x].record.bins.uId
                    ),
                    Aerospike.operations.write(
                      "uP",
                      allResults[batch + x].record.bins.uP
                    ),
                    Aerospike.operations.write(
                      "uN",
                      allResults[batch + x].record.bins.uN
                    ),
                    Aerospike.operations.write(
                      "gId",
                      allResults[batch + x].record.bins.gId
                    ),
                    Aerospike.operations.write(
                      "ds",
                      allResults[batch + x].record.bins.ds
                    ),
                    Aerospike.operations.write(
                      "qN",
                      allResults[batch + x].record.bins.qN
                    ),
                    Aerospike.operations.write(
                      "st",
                      allResults[batch + x].record.bins.st
                    ),
                    Aerospike.operations.write(
                      "po",
                      allResults[batch + x].record.bins.po
                    ),
                    Aerospike.operations.write(
                      "rk",
                      allResults[batch + x].record.bins.rk
                    ),
                    Aerospike.operations.write(
                      "eF",
                      allResults[batch + x].record.bins.eF
                    ),
                    Aerospike.operations.write(
                      "mS",
                      allResults[batch + x].record.bins.mS
                    ),
                    Aerospike.operations.write(
                      "cT",
                      allResults[batch + x].record.bins.cT
                    ),
                  ],
                });

                //Aerospike.maps.put("stats", allResults[batch + x].record.bins._id.toString(), stats)

                var stats = {
                  slipId: allResults[batch + x].record.bins._id,
                  contestId: allResults[batch + x].record.bins.cId,
                  setId: `${currentMonth}${currentYear}`,
                  createdAt: allResults[batch + x].record.bins.gSD,
                };

                batchRecords2.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    "allUsers",
                    allResults[batch + x].record.bins.uId.toString()
                  ),
                  ops: [Aerospike.lists.append("stats", stats)],
                });
              }
              // Send next batch after all promises resolved
              //console.log(promises);
              await aeroClient.batchWrite(batchRecords, policy);
              await aeroClient.batchWrite(batchRecords2, policy);

              console.log(
                "Shifting Slip Data to History......" +
                  (batch == 0 ? batchSize : batchSize + batch)
              );
            }

            console.log("Done Shifting Slip Data to History......");
          }
        });
      }
    }
  });
};

const updateRankInLoop = async (contestId, aeroClient) => {
  var loopCount = 1;
  var limitCount = 10000;
  var countObj = {};
  //console.time("batchUpdate");
  for (var i = 0; i < loopCount; i++) {
    conn.query(
      `SELECT cid,s,p, RANK() OVER (partition by cid ORDER BY p DESC)as r FROM _sir_zxy09_gaming_contests WHERE ev="${contestId}" LIMIT ${
        i * limitCount
      }, ${(i + 1) * limitCount}`,
      async function (err, result, fields) {
        if (err) throw err;
        if (result.length < 1) {
          //conn.end()
          return;
        } else {
          console.log("result data came from sql...............");
          console.log("result:", result);
          var newArray = {};
          for (var i = 0; i < result.length; i++) {
            if (result[i].cid in newArray) {
              newArray[result[i].cid] = [...newArray[result[i].cid], result[i]];
            } else {
              newArray[result[i].cid] = [result[i]];
            }
          }

          Object.keys(newArray).forEach((i) => {
            var count = countObj[i] ? countObj[i] : 0;
            newArray[i].forEach((item, idx) => {
              count++;
              item["c"] = count;

              if (idx == newArray[i].length - 1) {
                if (i in countObj) {
                  countObj[i] = countObj[i] + count;
                } else {
                  countObj[i] = count;
                }
              }
            });
          });

          Object.keys(newArray).forEach(async (item) => {
            var allResults = newArray[item];
            const batchType = Aerospike.batchType;
            var batchSize = 300;
            var policy = new Aerospike.BatchWritePolicy({
              totalTimeout: 50000,
              socketTimeout: 50000,
              maxRetries: 5,
            });

            for (let batch = 0; batch < allResults.length; batch += batchSize) {
              var batchRecords = [];

              for (
                let x = 0;
                x < batchSize && x + batch < allResults.length;
                x++
              ) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    "allSlips",
                    allResults[batch + x].s
                  ),
                  ops: [
                    Aerospike.operations.write("po", allResults[batch + x].p),
                    Aerospike.operations.write("rk", allResults[batch + x].r),
                    Aerospike.operations.write("spAS", allResults[batch + x].c),
                    //Aerospike.operations.write("st", "Won 0.00")
                  ],
                });
              }

              await aeroClient
                .batchWrite(batchRecords, policy)
                .catch((err) => console.log("Batchwrite Err:", err));

              console.log(
                "Inserting Slip Rank Data......" +
                  (batch == 0 ? batchSize : batchSize + batch)
              );
            }

            console.log("Done Inserting Slip Rank Data......");

            var socket = connectSocket();
            //console.log("mySocket:",socket);
            if (socket) {
              console.log("Reload Page Sent......" + `contestId-${item}`);
              socket.to(`contestId-${item}`).emit("reload available");
            }
          });
        }
        if (i == loopCount - 1) {
          console.timeEnd("batchUpdate");
        }

        conn.end();

        if (result.length > 0) {
          console.log("result.length:", result.length);
        }
      }
    );
  }
};

const updateRankPromise = async (contestId, aeroClient) => {
  console.log("Promise to resolve");
  return new Promise((resolve, reject) => {
    let streamData = conn
      .query(
        `SELECT s,p, RANK() OVER (ORDER BY p DESC)as r FROM _sir_zxy09_gaming_contests WHERE cid=${contestId} LIMIT 4`
      )
      .stream({ highWaterMark: 5 });
    let data = [];
    streamData.on("result", (row) => {
      data.push(row);
      //set after how many rows you want to pause. May need to tweak
      //if (data.length >= 100) {
      //console.log("Pushing data")
      streamData.pause();
      processRows();
      //}
    });
    streamData.on("end", (end) => {
      return resolve(data);
    });

    //update to aerospike or send to kafka
    const processRows = async (done) => {
      //console.log("updateRankPromise:",data.length);

      //var customId = uuidv4();

      //var parsedData = Buffer.from(JSON.stringify(data));
      // var contestResultKey = new Aerospike.Key(process.env.CLUSTER_NAME, "contestResult", customId.toString());
      // await aeroClient.put(contestResultKey, {data:parsedData});
      //await producer(JSON.stringify({contestData:data}), "contestResult");
      //console.log("Pushed to Producer")
      //streamData.resume();

      var allResults = data;
      const batchType = Aerospike.batchType;
      var batchSize = 2;
      var policy = new Aerospike.WritePolicy({
        totalTimeout: 50000,
        socketTimeout: 50000,
        maxRetries: 5,
      });

      for (let batch = 0; batch < allResults.length; batch += batchSize) {
        var batchRecords = [];

        for (let x = 0; x < batchSize && x + batch < allResults.length; x++) {
          batchRecords.push({
            type: batchType.BATCH_WRITE,
            key: new Aerospike.Key(process.env.CLUSTER_NAME, "allSlips", allResults[batch + x].s),
            ops: [
              Aerospike.operations.write("po", allResults[batch + x].p),
              Aerospike.operations.write("rk", allResults[batch + x].r),
            ],
          });
        }

        await aeroClient
          .batchWrite(batchRecords, policy)
          .catch((err) => console.log("Batchwrite Err:", err));

        console.log(
          "Inserting Slip Rank Data......" +
            (batch == 0 ? batchSize : batchSize + batch)
        );
      }

      console.log("Done Inserting Slip Rank Data......");

      streamData.resume();

      //streamData.pipe(new stream.Transform({
      //objectMode: true,
      //transform: function (data, encoding, callback) {
      //}
      //}))

      //resume stream for the next batch
      //streamData.resume();
    };
    streamData.on("error", (error) => {
      return reject(error);
    });
  });
};

async function batchUpload(packets,str) {
  // batchSize is set to 1000.
  let batchSize = 100;
  for (let batch = 0; batch < packets.length; batch += batchSize) {
    let promises = [];

    for (let x = 0; x < batchSize && x + batch < packets.length; x++) {
      promises.push(loadData(packets[batch + x],str));
    }
    // Send next batch after all promises resolved
    await Promise.all(promises.map((p) => p.catch(() => "failed"))).then(
      (results) =>
        console.log(
          results.filter((x) => x == "failed").length,
          " requests failed"
        )
    );
  }
}

async function loadData(packet,str) {
  const aerospikeClient = await getAerospikeClient();
  const policy = new Aerospike.WritePolicy({
    socketTimeout: 10000,
    totalTimeout: 10000,
  });
  // console.log(str)
  const key = new Aerospike.Key(process.env.CLUSTER_NAME, str, packet.id.toString());
  return aerospikeClient.put(key, packet, {}, policy).catch((error) => {
    console.log("Failied to insert");
    console.log(error);
  });
}


async function batchUpload2(packets,str) {
  // batchSize is set to 1000.
  let batchSize = 100;
  for (let batch = 0; batch < packets.length; batch += batchSize) {
    let promises = [];

    for (let x = 0; x < batchSize && x + batch < packets.length; x++) {
      promises.push(loadData2(packets[batch + x],str));
    }
    // Send next batch after all promises resolved
    await Promise.all(promises.map((p) => p.catch(() => "failed"))).then(
      (results) =>
        console.log(
          results.filter((x) => x == "failed").length,
          " requests failed"
        )
    );
  }
}

async function loadData2(packet,str) {
  const aerospikeClient = await getAerospikeClient();
  const policy = new Aerospike.WritePolicy({
    socketTimeout: 10000,
    totalTimeout: 10000,
  });
  const key = new Aerospike.Key(process.env.CLUSTER_NAME, `${str}`, packet.uid.toString());
  return aerospikeClient.put(key, packet, {}, policy).catch((error) => {
    console.log("Failied to insert");
    console.log(error);
  });
}

module.exports = run;


