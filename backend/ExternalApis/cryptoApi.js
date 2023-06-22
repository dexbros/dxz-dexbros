/** @format */

const axios = require("axios");
const Aerospike = require("aerospike");
const { defineAerospikeClient, getAerospikeClient } = require("../aerospike");
const batchType = Aerospike.batchType;
const fs = require("fs");

async function saveCryptoList() {
  var config = {
    method: "get",
    url: "https://api.coingecko.com/api/v3/coins/list",
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      const temp = response.data;
      let batchPolicy = new Aerospike.BatchPolicy({});
      var batchRecords = [];
      const client = await getAerospikeClient();

      for (let i = 0; i < 500; i++) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_CRYPTO_LIST,
            temp[i].name.slice(0, 2).toLowerCase()
          ),
          ops: [
            Aerospike.operations.write(
              "p_k",
              temp[i].name.slice(0, 2).toLowerCase()
            ), //primary key
            Aerospike.operations.write("name", temp[i].name),
            Aerospike.operations.write("symbol", temp[i].symbol),
            Aerospike.operations.write("id", temp[i].id), // user post list
          ],
        });
      }
      await client.batchWrite(batchRecords, batchPolicy);
      try {
        console.log("Saved...");
      } catch (error) {
        console.log(error.message);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function cryptoData() {
  console.log("Start");
  var axios = require("axios");

  var config = {
    method: "get",
    url: `${process.env.CRYPTO_API}`,
    headers: {},
  };

  axios(config)
    .then(async (result) => {
      let batchPolicy = new Aerospike.BatchPolicy({});
      var batchRecords = [];
      const client = await getAerospikeClient();
      const arr = result.data;
      let dataArr = [];

      for (let i = 0; i < arr.length; i++) {
        console.log("Step ", i);
        dataArr.push(arr[i]);
        var search_term = arr[i].name
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .split(" ")
          .join("");
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: new Aerospike.Key("test", "crypto_list", arr[i].id),
          ops: [
            Aerospike.operations.write("id", arr[i].id),
            Aerospike.operations.write("symbol", arr[i].symbol),
            Aerospike.operations.write("name", arr[i].name),
            Aerospike.operations.write("image", arr[i].image),
            Aerospike.operations.write("price", arr[i].current_price),
            Aerospike.operations.write(
              "c_s",
              search_term.slice(0, 2).toLowerCase()
            ),
          ],
        });
      }

      fs.exists("myjsonfile.json", (exists) => {
        if (!exists) {
          fs.writeFile(
            "myjsonfile.json",
            JSON.stringify(dataArr),
            async (err, result) => {
              if (err) {
                console.log(err);
              } else {
                await client.batchWrite(batchRecords, batchPolicy);
                try {
                  console.log("Saved crypto price...");
                } catch (error) {
                  console.log(error.message);
                }
              }
            }
          );
        } else {
          console.log("Already save");
        }
      });
    })
    .catch((error) => console.log("error", error));
}

// async function fetchAndSaveCryptoData() {
//   fs.readFile("cryptoList.json", async (err, data) => {
//     const arr = JSON.parse(data);

//     let batchPolicy = new Aerospike.BatchPolicy({});
//     var batchRecords = [];
//     const client = await getAerospikeClient();
//     let dataArr = [];

//     for (let i = 0; i < arr.length; i++) {
//       console.log("Step ", i);
//       dataArr.push(arr[i]);
//       var search_term = arr[i].name
//         .replace(/[^a-zA-Z0-9 ]/g, "")
//         .split(" ")
//         .join("");
//       batchRecords.push({
//         type: batchType.BATCH_WRITE,
//         key: new Aerospike.Key("test", "crypto_list", arr[i].id),
//         ops: [
//           Aerospike.operations.write("id", arr[i].id),
//           Aerospike.operations.write("symbol", arr[i].symbol),
//           Aerospike.operations.write("name", arr[i].name),
//           Aerospike.operations.write("image", arr[i].image),
//           Aerospike.operations.write("price", arr[i].current_price),
//           Aerospike.operations.write(
//             "c_s",
//             search_term.slice(0, 2).toLowerCase()
//           ),
//         ],
//       });
//     }

//     try {
//       console.log("Save***");
//     } catch (error) {
//       console.log(error);
//     }
//   });
// }
// fetchAndSaveCryptoData();

module.exports = { saveCryptoList, cryptoData };
