/** @format */

const Multer = require("multer");
const uuid = require("uuid");
const uuidv1 = uuid.v1;
const { Storage } = require("@google-cloud/storage");
const apiip = require("apiip.net")("28052519-acc6-412a-8469-961eca613fbe");

const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");
const { group } = require("console");
const maps = Aerospike.maps;
const exp = Aerospike.exp;
const now = require("nano-time");
const batchType = Aerospike.batchType;

const storage = new Storage({
  projectId: "quiztasy",
  credentials: {
    client_email: "dexbros-upload@quiztasy.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxtcYo4lgaK7gh\nV1z3UFRkV2HT28rUjuFKrQrfjEEKkzgZWgwu8V6SzPXPYmGWAFpLtYqgUP28QXoq\nXWCWLYlMcQA2OalnjNiilRy8Yq2Yjj75LPy2rKT8W14Cyr07inZxEWsrs5rS3Ycp\nw3nZnub5dxPXqewrjHPQUx0a5a6UiBDD7YdE1fHAniaxZz18yy9f6nOVWac0m5P2\ntHNgrB+CalwQIf51TCvJrfsPw0hFHHYlTWhA8ATZfPJxAXNLklo/roFr/LmfUnq0\nl1nFPQqTMj5jCOQ8DO5j0zFJvgZ/d0ePN0IOyUxhVH9Qq9oQRh7YqdDcr27Vos4H\nmXkoA36JAgMBAAECggEARyDBUqXdq4PqK/YisJ5HWO4cqsZjNZaGl/QQ0Q77DXeF\nUahYDgXv24QLstjmxDoZ6gmclbQ1Cr+OXRyIxzMsrBrigdGse1TFdLWIDeLVJqVw\nkR0vfRI26wbK5wUsnoM6CuF06sX1ZwbhzZZ+09qlCh5eI8jQTVHnHO/XS2e465uq\nIxMWwGBEy5ZVksWV+/OA+YvQMSMxar0AMvCTf2McoUGw/flxXrg4gnl/brI7p4El\nokYb6MVI38VvlQ87MshosDA4bxSj0IyHXzXHC3vJ4E1Ph1CjbHjtV4YVlLy0qH3K\n41UOEa5OPNSG5rvPAz/oQDjyFw2nuDVGpKRlqGteTQKBgQDy3xvXN7jyVr74r42V\n8H2BtyachzYtESrpLnoM4bHEZ3hzjnGrLSQUMFBleajcs+yCqcvzruW7mG5SNYNU\na7NrzncnGC1SOX5ej4oOOW8/K/cYbpqDP6f3NkKh7Xkb+xcbwuPvB+Sbl1sUNRfB\nyY5iVjr3x7GBo0g62AN52/+bvwKBgQC7UPOX/VoAmIpKXfzR9RX43/JsqIJ9WZdY\nK0ToMwskV2bN71T2u0D0/ryh6R7MeyIF5PgAZSyTFXLrlwm/GFzBXgew/4Hiud0g\n4W/h7UXpCDOWGq/Cik2VbshsCvDiJr05Q9SYEVyOj6702ZkEHNc5p1Jgao4xYKSV\nD3yZqfMXtwKBgAvG+eij0RofTr9sc+czdEKYCQ1KGTxyOqx4Dn8VarNleRfRbn2o\ngLlh5mQlVCTvrKZhaXx1nLpOF/twkN/FITw3FNwWdgwosZIQT9eEvXpIvYC3zFJV\nAeYhAXYst9S9hk9YUglDTrikzEvcjzxcc8Uc/VsKmfb5XgVMeE6udmStAoGAe+4z\nPHwC8CH8XPeSLddZki+Y1QsoSobb+xmlnXsoBANPoTCXpiZ985oWc4kpN2DAQeYb\nrydBNo8aWYS0jhowRD9SF2j1JmySQQ7mVzQE7QjgGI/PeYbHjfad493ZQccfqqOW\nJIZYFno55wWQl4f9Xce2WNQm/8RRH83/QiuPCkECgYEAz9WgZuz9tOF2Nl3qkW4I\naW7ViTE8XiFHMFZIh5LXyER98YUxVVRdNBOJtvlop6KXAIN9g8VzrOHvT34jd057\nEwAO4HDmE71PsdqrwgMCJEYGHhkv/ZXU2Hey0bqV0/ajvkcVN5mHm81j68fdqzB0\niBUDWp6KQ0+9BYstzxlNdbw=\n-----END PRIVATE KEY-----\n",
  },
});
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const bucket = storage.bucket("dexbros_files");
var createError = require("http-errors");

class BlockcastModal {
  constructor() {}

  // **** create one to one chat
  async createOneToOne(data, user, username) {
    const blockId = now.micro();
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // query.where(Aerospike.filter.equal("isGroup", false));
      query.select("b_id", "mem", "isGroup"); //select single bin
      const stream = query.foreach();
      var arr = [];

      stream.on("data", async function (record) {
        if (!record.bins.isGroup) {
          arr.push(record.bins);
        }
      });

      stream.on("end", async function (record) {
        if (arr.length === 0) {
          console.log("Nothing in array");
          const key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_BLOCKCAST,
            blockId
          );
          const bins = {
            b_id: blockId,
            name: "",
            user1: {
              name: `${data.user.fn} ${data.user.ln}`,
              handleUsername: data.user.handleUn,
              p_iture: data.user.p_i || "",
            },
            user2: {
              name: `${data.profile.fn} ${data.profile.ln}`,
              handleUsername: data.profile.handleUn,
              p_iture: data.profile.p_i || "",
            },
            isGroupChat: false,
            isoneChat: true,
            latestMsg: "",
            isDm: false,
            mem: [data.profile.handleUn, data.user.handleUn],
          };
          const result = await client.put(key, bins);
          try {
            const data = await client.get(key);
            resolve({
              msg: "Block cast has been created",
              blockcast: data.bins,
            });
          } catch (error) {
            throw createError.Conflict(error.message);
          }
        } else {
          console.log("Already have");
          for (let i = 0; i < arr.length; i++) {
            if (
              arr[i].mem.includes(username) &&
              arr[i].mem.includes(user.handleUn)
            ) {
              const key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_BLOCKCAST,
                arr[i].b_id
              );

              console.log(key);
              const data = await client.get(key);
              resolve({ msg: "Chat already create", blockcast: data.bins });
            } else {
              console.log("Else part");
              const key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_BLOCKCAST,
                blockId
              );
              const bins = {
                b_id: blockId,
                name: "",
                user1: {
                  name: `${data.user.fn} ${data.user.ln}`,
                  handleUsername: data.user.handleUn,
                  p_iture: data.user.p_i || "",
                },
                user2: {
                  name: `${data.profile.fn} ${data.profile.ln}`,
                  handleUsername: data.profile.handleUn,
                  p_iture: data.profile.p_i || "",
                },
                isGroupChat: false,
                latestMsg: "",
                isDm: false,
                mem: [data.profile.handleUn, data.user.handleUn],
              };
              const result = await client.put(key, bins);
              try {
                const data = await client.get(key);
                resolve({
                  msg: "Block cast has been created",
                  blockcast: data.bins,
                });
              } catch (error) {
                throw createError.Conflict(error.message);
              }
            }
          }
        }
      });
    });
  }

  // *** Fetch personal single and group messages
  async fetchPersonalChat(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // query.where(Aerospike.filter.equal("isGroup", false));
      // query.select("b_id", "mem", "isGroup"); //select single bin
      const stream = query.foreach();
      var arr = [];

      stream.on("data", async function (record) {
        if (record.bins.mem.includes(handleUn)) {
          if (record.bins.isoneChat || record.bins.isGroupChat) {
            arr.push(record.bins);
          }
        }
      });

      stream.on("end", async function (record) {
        resolve(arr);
      });
    });
  }

  // ****
  async createPersonalGroupChat(data, user) {
    return new Promise(async (resolve, reject) => {
      const blockId = now.micro();
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // query.where(Aerospike.filter.equal("isGroup", false));
      query.select("b_id", "mem", "isGroup"); //select single bin
      const stream = query.foreach();
      var arr = [];

      stream.on("data", async function (record) {
        if (!record.bins.isGroup) {
          arr.push(record.bins);
        }
      });

      stream.on("end", async function (record) {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          blockId
        );
        const bins = {
          b_id: blockId,
          b_p_img: data.image,
          name: data.name,
          des: data.description,
          b_c_un: user.handleUn,
          status: data.status,
          isGroupChat: true,
          mem: [...data.members, user.handleUn],
          country: "",
          city: "",
          latestMsg: "",
          blockUsers: [],
          admins: [],
          b_c_fn: user.fn,
          b_c_ln: user.ln,
        };
        // console.log(bins)
        const result = await client.put(key, bins);
        try {
          const data = await client.get(key);
          resolve({ msg: "Block cast has been created", blockcast: data.bins });
        } catch (error) {
          throw createError.Conflict(error.message);
        }
      });
    });
  }
}

module.exports = new BlockcastModal();

// return new Promise(async (resolve, reject) => {
