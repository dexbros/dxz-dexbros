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
const {
  fetchPersonalChat,
  createOneToOne,
  createPersonalGroupChat,
} = require("../model/blockcastMessage");

class BlockcastController {
  constructor() {}

  // *** Fetch full blockcast
  async fetchBlockcast(req, res, next) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid format" });
    } else {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        req.params.id
      );
      const data = await client.get(key);
      return res.status(200).json(data.bins);
    }
  }

  // *** blockcast channel join privacy
  async blockcastFeedProivacy(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        const ops = [Aerospike.operations.write("chnl_prv", req.body.join)];
        client.operate(key, ops, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Blockcast privacy updated" });
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** blockcast channel feed privacy
  async blockcastFeedViewPrivacy(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        const ops = [Aerospike.operations.write("feed_view", req.body.feed)];
        client.operate(key, ops, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Blockcast privacy updated" });
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** blockcast channel privacy
  async blockcastChannelViewPrivacy(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        const ops = [Aerospike.operations.write("chnl_view", req.body.channel)];
        client.operate(key, ops, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Blockcast privacy updated" });
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** like feed message
  async likeMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.likes.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("likes", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.append("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("funny", req.user.handleUn),
            Aerospike.lists.removeByValue("dilikes", req.user.handleUn),
            Aerospike.lists.removeByValue("wow", req.user.handleUn),
            Aerospike.lists.removeByValue("fire", req.user.handleUn),
            Aerospike.lists.removeByValue("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.likes.includes(req.user.handleUn)
                ? "Like removed"
                : "Like added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // *** funny feed message
  async funnyMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.funny.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("funny", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.append("funny", req.user.handleUn),
            Aerospike.lists.removeByValue("dilikes", req.user.handleUn),
            Aerospike.lists.removeByValue("wow", req.user.handleUn),
            Aerospike.lists.removeByValue("fire", req.user.handleUn),
            Aerospike.lists.removeByValue("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.funny.includes(req.user.handleUn)
                ? "funny removed"
                : "funny added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // *** fire feed message
  async fireMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.fire.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("fire", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("funny", req.user.handleUn),
            Aerospike.lists.removeByValue("dilikes", req.user.handleUn),
            Aerospike.lists.removeByValue("wow", req.user.handleUn),
            Aerospike.lists.append("fire", req.user.handleUn),
            Aerospike.lists.removeByValue("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.funny.includes(req.user.handleUn)
                ? "fire removed"
                : "fire added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // *** wow feed message
  async wowMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.wow.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("wow", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("funny", req.user.handleUn),
            Aerospike.lists.removeByValue("dilikes", req.user.handleUn),
            Aerospike.lists.append("wow", req.user.handleUn),
            Aerospike.lists.removeByValue("fire", req.user.handleUn),
            Aerospike.lists.removeByValue("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.funny.includes(req.user.handleUn)
                ? "wow removed"
                : "wow added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // *** dislike feed message
  async dislikeMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.dilikes.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("dilikes", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("funny", req.user.handleUn),
            Aerospike.lists.append("dilikes", req.user.handleUn),
            Aerospike.lists.removeByValue("wow", req.user.handleUn),
            Aerospike.lists.removeByValue("fire", req.user.handleUn),
            Aerospike.lists.removeByValue("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.funny.includes(req.user.handleUn)
                ? "dislikes removed"
                : "dislikes added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  // *** bow feed message
  async bowMessage(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const client = await getAerospikeClient();
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );

        const data = await client.get(message_key);
        var ops;
        if (data.bins.bow.includes(req.user.handleUn)) {
          ops = [Aerospike.lists.removeByValue("bow", req.user.handleUn)];
        } else {
          ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("funny", req.user.handleUn),
            Aerospike.lists.removeByValue("dilikes", req.user.handleUn),
            Aerospike.lists.removeByValue("wow", req.user.handleUn),
            Aerospike.lists.removeByValue("fire", req.user.handleUn),
            Aerospike.lists.append("bow", req.user.handleUn),
          ];
        }

        client.operate(message_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({
              msg: data.bins.funny.includes(req.user.handleUn)
                ? "bow removed"
                : "bow added",
            });
          }
        });
      }
    } catch (err) {
      next(err);
    }
  }

  async createBlockcast(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const blockId = new Date().getTime().toString();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        blockId
      );
      const { name, description, status } = req.body;
      const bins = {
        b_id: blockId,
        name: name,
        des: description,
        b_p_img: "",
        b_c_fn: req.user.fn,
        b_c_ln: req.user.ln,
        b_c_un: req.user.handleUn,
        status: status,
        isBlock: true,
        mem: [],
        admins: [],
        block: [],
        country: "",
        city: "",
        crypto: req.body.crypto,
      };
      const result = await client.put(key, bins);
      try {
        const data = await client.get(key);
        return res
          .status(201)
          .json({ msg: "Block cast has been created", blockcast: data.bins });
      } catch (error) {
        return res.status(400).json({ msg: err.message });
      }
    } catch (error) {
      next(error);
    }
  }

  async createDm(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const { username } = req.params;
      const blockId = now.micro();
      if (!username) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
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
                name: `${req.body.user.fn} ${req.body.user.ln}`,
                handleUsername: req.body.user.handleUn,
                p_iture: req.body.user.p_i || "",
              },
              user2: {
                name: `${req.body.profile.fn} ${req.body.profile.ln}`,
                handleUsername: req.body.profile.handleUn,
                p_iture: req.body.profile.p_i || "",
              },
              isGroupChat: false,
              latestMsg: "",
              isDm: false,
              mem: [req.body.profile.handleUn, req.body.user.handleUn],
            };
            const result = await client.put(key, bins);
            try {
              const data = await client.get(key);
              return res.status(201).json({
                msg: "Block cast has been created",
                blockcast: data.bins,
              });
            } catch (error) {
              return res.status(400).json({ msg: err.message });
            }
          } else {
            for (let i = 0; i < arr.length; i++) {
              if (
                arr[i].mem.includes(username) &&
                arr[i].mem.includes(req.user.handleUn)
              ) {
                const key = new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_BLOCKCAST,
                  arr[i].b_id
                );

                console.log(key);
                const data = await client.get(key);
                return res
                  .status(200)
                  .json({ msg: "Chat already create", blockcast: data.bins });
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
                    name: `${req.body.user.fn} ${req.body.user.ln}`,
                    handleUsername: req.body.user.handleUn,
                    p_iture: req.body.user.p_i || "",
                  },
                  user2: {
                    name: `${req.body.profile.fn} ${req.body.profile.ln}`,
                    handleUsername: req.body.profile.handleUn,
                    p_iture: req.body.profile.p_i || "",
                  },
                  isGroupChat: false,
                  latestMsg: "",
                  isDm: false,
                  mem: [req.body.profile.handleUn, req.body.user.handleUn],
                };
                const result = await client.put(key, bins);
                try {
                  const data = await client.get(key);
                  return res.status(201).json({
                    msg: "Block cast has been created",
                    blockcast: data.bins,
                  });
                } catch (error) {
                  return res.status(400).json({ msg: err.message });
                }
              }
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async recomendedBlockcast(req, res, next) {
    try {
      // console.log("Recomended")
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        console.log(data);
        // if (
        //   data.bins.b_c_un !== req.user.handleUn &&
        //   !data.bins.mem.includes(req.user.handleUn)
        // ) {
        //   arr.push(data.bins);
        // }
        if (data.bins.isBlock) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        // var temp = arr.filter((data) => data.status === "business");
        var temp = arr.filter((data) => data.b_c_un !== req.user.handleUn);
        var page = req.query.page || 1;
        var limit = req.query.limit || 10;
        var results = [];
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          temp = temp.slice(start, end);
        }
        return res.status(200).json(temp);
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchDms(req, res, next) {
    try {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (data.bins.isDm && data.bins.mem.includes(req.params.id)) {
          // console.log(data.bins);
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        // var temp = arr.filter((data) => data.status === "Normal");
        // var page = req.query.page || 1;
        // var limit = req.query.limit || 10;
        // var results = [];
        // var start = (page - 1) * limit;
        // var end = page * limit;
        // if (page <= limit) {
        //   temp = temp.slice(start, end);
        // }
        return res.status(200).json(arr);
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchMyBlockcast(req, res, next) {
    try {
      // console.log("Recomended")
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (data.bins.b_c_un === req.user.handleUn) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        var temp = arr.filter((data) => data.isBlock === true);

        var page = req.query.page || 1;
        var limit = req.query.limit || 10;
        var results = [];
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          temp = temp.slice(start, end);
        }
        return res.status(200).json(temp);
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchJoinBlockcast(req, res, next) {
    try {
      console.log("join");
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        // if (
        //   data.bins.mem.includes(req.user.handleUn) &&
        //   data.bins.b_c_un !== req.user.handleUn
        // ) {
        //   arr.push(data.bins);
        // }

        if (
          data.bins.isBlock &&
          data.bins.mem.includes(req.user.handleUn) &&
          data.bins.b_c_un !== req.user.handleUn
        ) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        var temp = arr.filter((data) => data.status === "business");

        var page = req.query.page || 1;
        var limit = req.query.limit || 10;
        var results = [];
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          temp = temp.slice(start, end);
        }
        return res.status(200).json(arr);
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchMyAllBlockcast(req, res, next) {
    try {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      // var query1 = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP_META);

      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (data.bins.b_c_un === req.user.handleUn) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        arr.sort((a, b) => b.b_id - a.b_id);
        var results = [];
        var page = req.query.page || 1;
        var limit = req.query.limit || 5;
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          results = arr.slice(start, end);
        }
        return res.status(200).json(results);
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchMyJoinBlockcast(req, res, next) {
    try {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST
      );
      // var query1 = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP_META);

      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (
          data.bins.b_c_dun !== req.user.handleUn &&
          data.bins.mem.includes(req.user.handleUn) &&
          data.bins.isBlock
        ) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        arr.sort((a, b) => b.b_id - a.b_id);
        var results = [];
        var page = req.query.page || 1;
        var limit = req.query.limit || 5;
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          results = arr.slice(start, end);
        }
        return res.status(200).json(results);
      });
    } catch (error) {
      next(error);
    }
  }

  async addRemoveUser(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const blockId = req.params.id;
      const username = req.user.handleUn;
      if (!blockId || !username) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          blockId
        );
        const data = await client.get(key);
        if (data.bins.b_c_dun === username) {
          return res.status(401).json({ msg: "You cannot leave this block" });
        } else {
          if (data.bins.mem.includes(username)) {
            const ops = [Aerospike.lists.removeByValue("mem", username)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                return res.status(401).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "User removed", result });
              }
            });
          } else {
            const ops = [Aerospike.lists.append("mem", username)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                return res.status(401).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "User added", result });
              }
            });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchSingleBlockcast(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        const data = await client.get(key);
        try {
          return res.status(200).json(data.bins);
        } catch (error) {
          return res.status(401).json({ msg: error.message });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async createMessageByUser(req, res, next) {
    console.log("#### CALL ####");
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      // var arr = req.body.content.split(" ");
      // var url;
      // for (let i = 0; i < arr.length; i++) {
      //   if (arr[i].includes("https://" || "http://" || "www.")) {
      //     var url = arr[i];
      //     arr.splice(i, 1);
      //   }
      // }
      // req.body.content = arr.join(" ");
      // const messageId = new Date().getTime().toString();
      // if (!req.file) {
      //   const message_key = new Aerospike.Key(
      //     process.env.CLUSTER_NAME,
      //     process.env.SET_BLOCK_MESSAGE,
      //     messageId
      //   );
      //   const message_bins = {
      //     m_id: messageId,
      //     chatId: req.params.id,
      //     content: req.body.content,
      //     gif: req.body.gif,
      //     image: "",
      //     url: url || "",
      //     m_u_id: req.user.u_id,
      //     m_u_fn: req.user.fn,
      //     m_u_ln: req.user.ln,
      //     m_u_dun: req.user.handleUn,
      //     m_u_pic: req.user.p_i,
      //     c_t: new Date().getTime().toString(),
      //     u_t: new Date().getTime().toString(),
      //     pinn: false,
      //     count: 0,
      //   };
      //   const data = await client.put(message_key, message_bins);
      //   try {
      //     const data = await client.get(message_key);
      //     return res.status(200).json(data.bins);
      //   } catch (err) {
      //     return res.status(401).json({ msg: err.message });
      //   }
      // } else {
      //   console.log("Image");
      //   const newImageName = messageId + "-" + req.file.originalname;
      //   const blob = bucket.file(`post/grid` + newImageName);
      //   const blobStream = blob.createWriteStream({
      //     resumable: false,
      //     gzip: true,
      //   });
      //   blobStream.on("error", (err) => {
      //     console.log(err);
      //     return res.status(400).json({ msg: err.message });
      //   });
      //   blobStream.on("finish", async () => {
      //     const publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
      //     const message_key = new Aerospike.Key(
      //       process.env.CLUSTER_NAME,
      //       process.env.SET_BLOCK_MESSAGE,
      //       messageId
      //     );
      //     const message_bins = {
      //       m_id: messageId,
      //       chatId: req.params.id,
      //       content: req.body.content,
      //       image: publicURL,
      //       url: url || "",
      //       m_u_id: req.user._id,
      //       m_u_fn: req.user.firstName,
      //       m_u_ln: req.user.lastName,
      //       m_u_dun: req.user.handleUn,
      //       m_u_pic: req.user.p_i,
      //       c_t: new Date().getTime().toString(),
      //       u_t: new Date().getTime().toString(),
      //     };
      //     const data = await client.put(message_key, message_bins);
      //     try {
      //       const data = await client.get(message_key);
      //       return res.status(200).json(data.bins);
      //     } catch (err) {
      //       return res.status(401).json({ msg: err.message });
      //     }
      //   });
      //   blobStream.end(req.file.buffer);
      // }
      var url = "";
      const messageId = new Date().getTime().toString();
      const newImageName = messageId + "-" + req.file.originalname;
      const blob = bucket.file(`post/grid` + newImageName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true,
      });
      blobStream.on("error", (err) => {
        console.log(err);
        return res.status(400).json({ msg: err.message });
      });

      blobStream.on("finish", async () => {
        const publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        // console.log(publicURL);
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          messageId
        );
        const message_bins = {
          m_id: messageId,
          chatId: req.params.id,
          content: req.body.content || "",
          image: publicURL,
          url: url || "",
          m_u_id: req.user.u_id,
          m_u_fn: req.user.fn,
          m_u_ln: req.user.ln,
          m_u_dun: req.user.handleUn,
          m_u_pic: req.user.p_i,
          likes: [],
          funny: [],
          dilikes: [],
          wow: [],
          fire: [],
          bow: [],
          c_t: new Date().getTime().toString(),
          u_t: new Date().getTime().toString(),
        };
        const data = await client.put(message_key, message_bins);
        try {
          const data = await client.get(message_key);
          return res.status(200).json(data.bins);
        } catch (err) {
          return res.status(401).json({ msg: err.message });
        }
      });

      blobStream.end(req.file.buffer);
    }
  }

  async fetchMessages(req, res, next) {
    try {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_MESSAGE
      );
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (req.params.id === data.bins.chatId) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        // console.log(arr);
        return res.status(200).json(arr);
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessages(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );
        client
          .exists(message_key)
          .then(async (data) => {
            // console.log(data)
            const message_data = await client.get(message_key);
            if (data) {
              client.remove(message_key, async (err, result) => {
                if (err) {
                  return res.status(401).json({ msg: err.message });
                } else {
                  return res.status(200).json({
                    msg: "Message has been deleted",
                    message: message_data.bins,
                  });
                }
              });
            }
          })
          .catch((err) => {
            return res.status(401).json({ msg: err.message });
          });
      }
    } catch (error) {
      next(error);
    }
  }

  async pinnedMessage(req, res, next) {
    const client = await getAerospikeClient();
    console.log("Call");
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const message_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_MESSAGE,
        req.params.id
      );
      const data = await client.get(message_key);
      // console.log(data.bins);
      if (!data.bins.pinn) {
        const message_ops = [Aerospike.operations.write("pinn", true)];
        client.operate(message_key, message_ops, async (err, result) => {
          if (err) {
            return res.status(401).json({ msg: err.message });
          } else {
            console.log(result);
            var data = await client.get(message_key);
            return res
              .status(200)
              .json({ msg: "You pinned this message", message: data.bins });
          }
        });
      } else {
        const message_ops = [Aerospike.operations.write("pinn", false)];
        client.operate(message_key, message_ops, async (err, result) => {
          if (err) {
            return res.status(401).json({ msg: err.message });
          } else {
            console.log(result);
            var data = await client.get(message_key);
            return res
              .status(200)
              .json({ msg: "You unpinned this message", message: data.bins });
          }
        });
      }
    }
  }

  async ChatlikeMessage(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const message_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_MESSAGE,
          req.params.id
        );
        const data = await client.get(message_key);
        if (data.bins.likes && data.bins.likes.includes) {
          const ops = [Aerospike.lists.removeByValue("likes", req.user.u_id)];
          client
            .operate(message_key, ops)
            .then((data) => {
              return res.status(200).json({ msg: "You dislike this message" });
            })
            .catch((err) => {
              return res.status(400).json({ msg: err.message });
            });
        } else {
          const ops = [Aerospike.lists.append("likes", req.user.u_id)];
          client
            .operate(message_key, ops)
            .then((data) => {
              return res.status(200).json({ msg: "You liked this message" });
            })
            .catch((err) => {
              return res.status(400).json({ msg: err.message });
            });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async createBlockcastComment(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const commentId = new Date().getTime().toString();
      const comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT,
        commentId
      );
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        console.log(req.params.id);
        if (!req.file) {
          const comment_bins = {
            c_id: commentId,
            chatId: req.params.id,
            content: req.body.content,
            gif: req.body.gif,
            c_u_fn: req.user.fn,
            c_u_ln: req.user.ln,
            c_u_dun: req.user.handleUn,
            c_u_pic: req.user.p_i,
            c_t: new Date().getTime().toString(),
            u_t: new Date().getTime().toString(),
            like: 0,
            spam: [],
          };
          const data = await client.put(comment_key, comment_bins);

          const chat_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_BLOCKCAST,
            req.params.id
          );
          const chat_ops = [
            Aerospike.operations.write(
              "latestMsg",
              req.body.content.trim() ? req.body.content : "Image"
            ),
          ];

          try {
            const updatedChat = await client.operate(chat_key, chat_ops);
            const data = await client.get(comment_key);
            return res.status(200).json(data.bins);
          } catch (err) {
            return res.status(401).json({ msg: err.message });
          }
        } else {
          const newImageName = commentId + "-" + req.file.originalname;
          const blob = bucket.file(`message/grid` + newImageName);
          const blobStream = blob.createWriteStream({
            resumable: false,
            gzip: true,
          });
          blobStream.on("error", (err) => {
            console.log(err);
            return res.status(400).json({ msg: err.message });
          });
          blobStream.on("finish", async () => {
            const publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
            console.log(publicURL);

            const comment_bins = {
              c_id: commentId,
              chatId: req.params.id,
              content: req.body.content,
              c_u_fn: req.user.fn,
              c_u_ln: req.user.ln,
              c_u_dun: req.user.handleUn,
              c_u_pic: req.user.p_i,
              c_t: new Date().getTime().toString(),
              u_t: new Date().getTime().toString(),
              like: 0,
              spam: [],
              image: publicURL,
            };
            const data = await client.put(comment_key, comment_bins);

            const chat_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_BLOCKCAST,
              req.params.id
            );
            // const ops = [
            //   Aerospike.operations.write("lastMsg", req.body.content || "Image"),
            // ];
            // const result = await client.operate(chat_key, ops);

            try {
              const data = await client.get(comment_key);
              return res.status(200).json(data.bins);
            } catch (err) {
              return res.status(401).json({ msg: err.message });
            }
          });
          blobStream.end(req.file.buffer);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async commentReply(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const commentId = new Date().getTime().toString();
      const comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT,
        commentId
      );

      const comment_bins = {
        c_id: commentId,
        chatId: req.params.id,
        content: req.body.message,
        c_u_fn: req.user.fn,
        c_u_ln: req.user.ln,
        c_u_dun: req.user.handleUn,
        c_u_pic: req.user.p_i,
        c_t: new Date().getTime().toString(),
        u_t: new Date().getTime().toString(),
        like: 0,
        spam: [],
        isReply: true,
        ori_data: {
          reply_text: req.body.content,
          c_u_fn: req.body.fn,
          c_u_ln: req.body.ln,
          gif: req.body.gif,
          image: req.body.image,
        },
      };
      console.log(comment_bins);
      const data = await client.put(comment_key, comment_bins);

      const chat_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        req.params.id
      );
      // const ops = [Aerospike.operations.write("lastMsg", req.body.content)];
      // const result = await client.operate(chat_key, ops);

      try {
        const data = await client.get(comment_key);
        return res.status(200).json(data.bins);
      } catch (err) {
        return res.status(401).json({ msg: err.message });
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchComments(req, res, next) {
    const client = await getAerospikeClient();
    var query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_COMMENT
    );
    var stream = query.foreach();
    // var stream1 = query1.foreach();
    var arr = [];

    stream.on("data", async (data) => {
      if (req.params.id === data.bins.chatId) {
        arr.push(data.bins);
      }
    });

    stream.on("end", function (posts) {
      // console.log(arr);
      return res.status(200).json(arr);
    });
  }

  async pinnedComment(req, res, next) {
    const client = await getAerospikeClient();
    const comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_COMMENT,
      req.params.id
    );
    const data = await client.get(comment_key);
    if (!data.bins) {
      return res.status(401).json({ msg: "No such comment found" });
    } else {
      if (data.bins.pinn) {
        // console.log("Already pinned");
        const comment_ops = [Aerospike.operations.write("pinn", false)];
        client.operate(comment_key, comment_ops, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            var data = await client.get(comment_key);
            return res
              .status(200)
              .json({ msg: "Comment unpinned", comment: data.bins });
          }
        });
      } else {
        // console.log("Not yet");
        const comment_ops = [Aerospike.operations.write("pinn", true)];
        client.operate(comment_key, comment_ops, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            var data = await client.get(comment_key);
            return res
              .status(200)
              .json({ msg: "Comment pinned", comment: data.bins });
          }
        });
      }
    }
  }

  async spamComment(req, res, next) {
    const client = await getAerospikeClient();
    const comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_COMMENT,
      req.params.id
    );
    const data = await client.get(comment_key);
    // console.log(data.bins);

    const comment_spam_ops = [
      Aerospike.lists.append("spam", req.user.handleUn),
    ];
    client.operate(comment_key, comment_spam_ops, async (err, result) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      } else {
        const data = await client.get(comment_key);
        return res
          .status(200)
          .json({ msg: "You mark this comment as spam", comment: data.bins });
      }
    });
  }

  async commentLike(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT,
        req.params.id
      );
      const data = await client.get(comment_key);

      const comment_ops = [Aerospike.operations.incr("like", 1)];
      client.operate(comment_key, comment_ops, async (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          var data = await client.get(comment_key);
          return res
            .status(200)
            .json({ msg: "You liked this comment", comment: data.bins });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async addRemoveAdmin(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const blockId = req.params.blockId;
      const username = req.body.username;
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        blockId
      );
      const data = await client.get(key);
      if (!data.bins) {
        return res.status(400).json({ msg: "Blockcask id is invalid" });
      } else {
        if (data.bins.admins.includes(username)) {
          // console.log("Already admin");
          block_ops = [Aerospike.lists.removeByValue("admins", username)];

          client.operate(key, block_ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const data = await client.get(key);
              return res.status(200).json({
                msg: "User removed from admin list",
                block: data.bins,
              });
            }
          });
        } else {
          // console.log("Not yet");
          block_ops = [Aerospike.lists.append("admins", username)];
          client.operate(key, block_ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const data = await client.get(key);
              return res
                .status(200)
                .json({ msg: "User added as admin", block: data.bins });
            }
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async editMessage(req, res, next) {
    try {
      console.log("HI");
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_COMMENT,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [
              Aerospike.operations.write("content", req.body.content),
            ];
            const result = await client.operate(key, ops);
            try {
              return res.status(400).json({ msg: "Message updated", result });
            } catch (error) {
              return res.status(400).json({ msg: error.message });
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async SingleChatlikeMessage(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_COMMENT,
          req.params.id
        );
        const data = await client.get(key);

        if (data.bins.likes && data.bins.likes.includes(req.user.handleUn)) {
          const ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
          const result = await client.operate(key, ops);
          try {
            return res.status(200).json({ msg: "You dislike this message" });
          } catch (error) {
            return res.status(200).json({ msg: error.message });
          }
        } else {
          const ops = [Aerospike.lists.append("likes", req.user.handleUn)];
          const result = await client.operate(key, ops);
          try {
            return res.status(200).json({ msg: "You like this message" });
          } catch (error) {
            return res.status(200).json({ msg: error.message });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async updateChatName(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCK_COMMENT,
          req.params.id
        );
        const data = await client.get(key);

        if (data.bins.save && data.bins.save.includes(req.user.handleUn)) {
          const ops = [
            Aerospike.lists.removeByValue("save", req.user.handleUn),
          ];
          const result = await client.operate(key, ops);
          try {
            return res.status(200).json({ msg: "You remove this message" });
          } catch (error) {
            return res.status(200).json({ msg: error.message });
          }
        } else {
          const ops = [Aerospike.lists.append("save", req.user.handleUn)];
          const result = await client.operate(key, ops);
          try {
            return res.status(200).json({ msg: "You save this message" });
          } catch (error) {
            return res.status(200).json({ msg: error.message });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async updateChatImage(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const newImageName = req.params.id + "-" + req.file.originalname;
              const blob = bucket.file(`block/grid` + newImageName);
              const blobStream = blob.createWriteStream({
                resumable: false,
                gzip: true,
              });
              blobStream.on("error", (err) => {
                console.log(err);
                return res.status(400).json({ msg: err.message });
              });
              blobStream.on("finish", async () => {
                const publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
                // console.log(publicURL);
                const ops = [Aerospike.operations.write("b_p_img", publicURL)];
                const result = await client.operate(key, ops);
                try {
                  const data = await client.get(key);
                  return res.status(200).json(data.bins);
                } catch (error) {
                  return res.status(400).json({ msg: error.message });
                }
              });
              blobStream.end(req.file.buffer);
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateBio(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const ops = [
                Aerospike.operations.write("des", req.body.descripton),
              ];
              const result = await client.operate(key, ops);
              try {
                const data = await client.get(key);
                return res.status(200).json(data.bins);
              } catch (error) {
                return res.status(400).json({ msg: error.message });
              }
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchMembers(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const arr = req.body.members;
              console.log(arr);
              var temp = [];
              for (let i = 0; i < arr.length; i++) {
                temp.push({
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_USERS,
                    arr[i]
                  ),
                  readAllBins: true,
                });
              }
              temp.push({
                key: new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_USERS,
                  req.user.handleUn
                ),
                readAllBins: true,
              });

              client.batchRead(temp, async (err, results) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // console.log(results)
                  return res.status(200).json(results);
                }
              });
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async removeGroupMembers(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const ops = [
                Aerospike.lists.removeByValue("mem", req.body.username),
              ];
              console.log(req.body.username);
              const result = await client.operate(key, ops);
              try {
                const data = await client.get(key);
                return res.status(200).json(data.bins);
              } catch (error) {
                return res.status(400).json({ msg: error.message });
              }
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async addToGroupAdmin(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Empty parametr" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        req.params.id
      );
      client.exists(key, async (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "Group does not exists" });
          } else {
            console.log(req.body.username);
            const ops = [Aerospike.lists.append("admins", req.body.username)];
            console.log("ADMIN: ", req.body.username);
            const result = await client.operate(key, ops);
            client.operate(key, ops, async (error, result) => {
              if (error) {
                return res.status(400).json({ msg: error.message });
              } else {
                const data = await client.get(key);
                return res.status(200).json(data.bins);
              }
            });
          }
        }
      });
    }
  }

  async fetchAdminLists(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const arr = req.body.members;
              var temp = [];
              for (let i = 0; i < arr.length; i++) {
                temp.push({
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_USERS,
                    arr[i]
                  ),
                  readAllBins: true,
                });
              }
              temp.push({
                key: new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_USERS,
                  req.user.handleUn
                ),
                readAllBins: true,
              });

              client.batchRead(temp, async (err, results) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // console.log(results)
                  return res.status(200).json(results);
                }
              });
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async addBlockList(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const ops = [
                Aerospike.lists.append("blockUsers", req.body.username),
              ];
              const result = await client.operate(key, ops);
              try {
                const data = await client.get(key);
                return res.status(200).json(data.bins);
              } catch (error) {
                return res.status(400).json({ msg: error.message });
              }
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchBlockUsersList(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        const key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          req.params.id
        );
        client.exists(key, async (err, data) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!data) {
              return res.status(400).json({ msg: "Group does not exists" });
            } else {
              const arr = req.body.members;
              console.log(arr);
              var temp = [];
              for (let i = 0; i < arr.length; i++) {
                temp.push({
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_USERS,
                    arr[i]
                  ),
                  readAllBins: true,
                });
              }
              temp.push({
                key: new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_USERS,
                  req.user.handleUn
                ),
                readAllBins: true,
              });

              client.batchRead(temp, async (err, results) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // console.log(results)
                  return res.status(200).json(results);
                }
              });
            }
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   *@PERSONAL_MESSAGE
   */
  async createOneToOneChat(req, res, next) {
    try {
      const { username } = req.params;
      const blockId = now.micro();
      if (!username) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await createOneToOne(req.body, req.user, username);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async createGroupChat(req, res, next) {
    try {
      console.log("*****");
      const data = await createPersonalGroupChat(req.body, req.user);

      return res.status(200).josn(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchPersonalMessages(req, res, next) {
    try {
      const data = await fetchPersonalChat(req.user.handleUn);
      console.log(req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlockcastController();
