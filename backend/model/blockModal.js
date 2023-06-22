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
const { uploadImage } = require("../helper/uploadImage");

var createError = require("http-errors");

class BlockModal {
  constructor() {}

  async createNewBlock(user, data) {
    return new Promise(async (resolve, reject) => {
      console.log(data);
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();

      var members = [];
      members.push(user.handleUn);

      var groupId = data.handlename;

      const b_s_k = data.name
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .join("");

      var group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        groupId
      );
      client.exists(group_key, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (result) {
            throw createError.BadRequest({
              msg: "Block handle name has already taken",
            });
          } else {
            // GROUP META KEY
            const group_meta_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP_META,
              groupId
            );
            // GROUP META SEARCH KEY
            const group_search_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP_SEARCH,
              groupId
            );
            // BLOCKCAST KEY
            const block_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_BLOCKCAST,
              groupId
            );
            let batchPolicy1 = new Aerospike.BatchPolicy({});
            var batchRecords = [];

            // **** Here we generate keys for TRENDING post
            let trending_key = [];
            var batchArrKeys = [
              group_key,
              group_meta_key,
              group_search_key,
              block_key,
            ];

            for (let i = 0; i < batchArrKeys.length; i++) {
              if (batchArrKeys[i].set === process.env.SET_GROUP) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("g_id", groupId),
                    Aerospike.operations.write("g_n", data.name),
                    Aerospike.operations.write("g_p_img", ""),
                    Aerospike.operations.write("g_c_img", ""),
                    Aerospike.operations.write("g_c_fn", user.fn),
                    Aerospike.operations.write("g_c_ln", user.ln),
                    Aerospike.operations.write("g_c_dun", user.handleUn),
                    Aerospike.operations.write("g_c_id", user.u_id.toString()),
                    Aerospike.operations.write("g_bio", data.body),
                    Aerospike.operations.write("g_mem", members),
                    Aerospike.operations.write("hide", []),
                    Aerospike.operations.write("visitors", 0),
                    Aerospike.operations.write("unique_v", 0),
                    Aerospike.operations.write("admins", []),
                    Aerospike.operations.write("banned_word", []),
                    Aerospike.operations.write("banned", []),
                    Aerospike.operations.write("g_type", data.type),
                    Aerospike.operations.write("tod", data.accountType),
                    Aerospike.operations.write("symbol", data.symbol),
                  ],
                });
              } else if (batchArrKeys[i].set === process.env.SET_GROUP_META) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("g_id", groupId),
                    Aerospike.operations.write("posts", []),
                    Aerospike.operations.write("events", []),
                    Aerospike.operations.write("visitors", []),
                    Aerospike.operations.write("unique_v", []),
                  ],
                });
              } else if (batchArrKeys[i].set === process.env.SET_GROUP_SEARCH) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("b_id", groupId),
                    Aerospike.operations.write("b_n", data.name),
                    Aerospike.operations.write("b_m", members.length),
                    Aerospike.operations.write("g_c_dun", user.handleUn),
                    Aerospike.operations.write("b_t", data.type),
                    Aerospike.operations.write("g_p_img", ""),
                    Aerospike.operations.write(
                      "s_t",
                      b_s_k.slice(0, 2).toLowerCase()
                    ),
                    Aerospike.operations.write(
                      "b_pri",
                      data.status === "Private" ? 1 : 0
                    ),
                    Aerospike.operations.write("g_bio", data.body),
                  ],
                });
              } else if (batchArrKeys[i].set === process.env.SET_BLOCKCAST) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("b_id", groupId),
                    Aerospike.operations.write("name", data.name),
                    Aerospike.operations.write("des", data.body),
                    Aerospike.operations.write("b_p_img", ""),
                    Aerospike.operations.write("b_c_fn", user.fn),
                    Aerospike.operations.write("b_c_ln", user.ln),
                    Aerospike.operations.write("b_c_un", user.handleUn),
                    Aerospike.operations.write("isBlock", true),
                    Aerospike.operations.write("mem", [user.handleUn]),
                    Aerospike.operations.write("admins", []),
                    Aerospike.operations.write("block", []),
                    Aerospike.operations.write("crypto", data.type),
                  ],
                });
              }
            }
            await client.batchWrite(batchRecords, batchPolicy1);
            var result = await client.get(group_key);
            console.log(result.bins);
            resolve({ msg: "Group has been created", group: result.bins });
          }
        }
      });
    });
  }

  async updateBlockCoverImage(file, id) {
    console.log("File Data: ", file);
    const publicURL = await uploadImage(file);
    console.log("publicURL>> ", publicURL);
    const client = await getAerospikeClient();

    return new Promise(async (resolve, reject) => {
      const group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      client
        .exists(group_key)
        .then((data) => {
          if (data) {
            const group_ops = [
              Aerospike.operations.write("g_c_img", publicURL),
            ];
            client.operate(group_key, group_ops, async (err, result) => {
              if (err) {
                throw createError.Conflict({ msg: err.message });
              } else {
                const data = await client.get(group_key);
                resolve(data);
              }
            });
          } else {
            console.log("No key found");
            throw createError.Conflict("No key found");
          }
        })
        .catch((err) => {
          throw createError.Conflict({ msg: err.message });
        });
    });
  }

  async updateBlockProfileImage(file, id) {
    const client = await getAerospikeClient();
    console.log("File Data: ", file);
    const publicURL = await uploadImage(file);
    console.log("publicURL >> ", publicURL);
    return new Promise(async (resolve, reject) => {
      const group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      client
        .exists(group_key)
        .then((data) => {
          if (data) {
            const group_ops = [
              Aerospike.operations.write("g_p_img", publicURL),
            ];
            client.operate(group_key, group_ops, async (err, result) => {
              if (err) {
                throw createError.Conflict({ msg: err.message });
              } else {
                const data = await client.get(group_key);
                resolve(data);
              }
            });
          } else {
            console.log("No key found");
            throw createError.Conflict("No key found");
          }
        })
        .catch((err) => {
          throw createError.Conflict({ msg: err.message });
        });
    });
  }

  async blockupdateJoinPrivacy(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("join_prv", data.join_prv)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async blockUpdatePostPrivacy(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();

      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("post_prv", data.post_prv)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async blockUpdateEventPrivacy(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("eve_prv", data.event)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async blockUpdateDMPrivacy(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("dm_prv", data.dm_prv)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group DM privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async BlockDetailsPrivacy(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("view", data.view)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group details privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async BlockMembersList(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("l_view", data.l_view)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group details privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async changeBlockBioDetails(id, data) {
    const client = await getAerospikeClient();
    return new Promise(async (resolve, reject) => {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest("Invalid params");
        } else {
          if (!result) {
            throw createError.BadRequest("No group found");
          } else {
            const ops = [Aerospike.operations.write("g_bio", data.bio)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Group details privacy updated" });
              }
            });
          }
        }
      });
    });
  }

  async changeBlockCastBio(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        id
      );
      client.exists(key, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!result) {
            return res.status(400).json({ msg: "No blockcast found" });
          } else {
            const ops = [Aerospike.operations.write("des", data.bio)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Blockcast bio has been updated" });
              }
            });
          }
        }
      });
    });
  }

  async fetchRecomendedBlock(handleUn, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (!data.bins.g_mem.includes(handleUn)) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        console.log(arr);

        var start = (page - 1) * limit;
        var end = page * limit;
        arr = arr.slice(start, end);
        resolve(arr);
      });
    });
  }

  async fetchMyBlockGroup(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);

      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (data.bins.g_c_dun === handleUn) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        const temp = arr.sort((a, b) => b.g_id - a.g_id);
        resolve(arr);
      });
    });
  }

  async fetchMyJoinGroup(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);

      var stream = query.foreach();
      // var stream1 = query1.foreach();
      var arr = [];

      stream.on("data", async (data) => {
        if (
          data.bins.g_mem.includes(handleUn) &&
          data.bins.g_c_dun !== handleUn
        ) {
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        // console.log(arr);
        resolve(arr);
      });
    });
  }

  async fetchFullSingleBlock(id) {
    const client = await getAerospikeClient();
    var group_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP,
      id
    );
    const group_data = await client.get(group_key);
    try {
      // console.log(group_meta_data.bins);
      return group_data.bins;
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async fetchSingleBlockAnalytics(id) {
    const client = await getAerospikeClient();
    var group_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP,
      id
    );
    const group_data = await client.get(group_key);
    try {
      var group_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_META,
        id
      );
      const group_meta_data = await client.get(group_meta_key);
      // console.log(group_meta_data.bins);
      // const obj = { ...group_data.bins, ...group_meta_data.bins };
      return { block: group_data.bins, meta: group_meta_data.bins };
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async FollowOneGroup(id, user) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // query.select(["g_mem"]); //select single bin
      query.where(Aerospike.filter.equal("g_id", id));
      const stream = query.foreach();

      stream.on("data", async function (record) {
        let arr = record.bins.g_mem;
        console.log(record.bins);
        if (arr.includes(user.handleUn)) {
          const ops = [Aerospike.lists.removeByValue("g_mem", user.handleUn)];
          await client.operate(group_key, ops);
        } else {
          const ops = [Aerospike.lists.append("g_mem", user.handleUn)];
          await client.operate(group_key, ops);
          try {
            // *** save notification data
            const map_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_APP_HISTORY,
              record.bins.g_c_dun
            );
            const map_ops = [
              Aerospike.operations.write("n_id", record.bins.g_c_dun),
              Aerospike.maps.put(
                "notification",
                Date.now(),
                {
                  id: user.handleUn,
                  ty: 9,
                  vi: false,
                  wo: user.handleUn,
                  ti: Date.now(),
                  nm: `${user.fn} ${user.ln}`,
                  pi: user.p_i,
                  cat: 0,
                },
                {
                  order: maps.order.KEY_ORDERED,
                }
              ),
              Aerospike.operations.incr("count", 1),
            ];
            let result = await client.operate(map_key, map_ops);
          } catch (error) {
            throw createError.BadRequest(err.message);
          }
        }
      });

      stream.on("end", async function (record) {
        // const data = await client.get(group_key);

        const cast_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_BLOCKCAST,
          id
        );
        const ops = [Aerospike.lists.append("mem", user.handleUn)];
        await client.operate(cast_key, ops);
        resolve({ msg: "User added in the group" });
      });
    });
  }

  async fetchSearchBlock(search) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_SEARCH
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      const input_query = search;
      const search_query = search.slice(0, 2);

      query.where(Aerospike.filter.equal("s_t", search_query)); //first filter out the result before applying expression regex query

      const queryPolicy = new Aerospike.QueryPolicy({});

      queryPolicy.filterExpression = exp.cmpRegex(
        Aerospike.regex.ICASE | Aerospike.regex.NEWLINE,
        "^" + input_query,
        exp.binStr("b_n")
      );

      var arr = [];
      const stream = query.foreach(queryPolicy);
      stream.on("data", function (record) {
        arr.push(record.bins);
        // console.log("*** Group Search List ***")
        // console.log(record.bins)
      });
      stream.on("end", function (posts) {
        // console.log(arr);
        resolve({ block: arr });
      });
    });
  }

  async updatingBlocGroupName(id, value) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );

      client.exists(key, (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!data) {
            return res.status(400).json({ msg: "No block found" });
          } else {
            const ops = [Aerospike.operations.write("g_n", value.name)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve(result);
              }
            });
          }
        }
      });
    });
  }

  async BlockUpdateName(id, value) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCKCAST,
        id
      );

      client.exists(key, (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!data) {
            return res.status(400).json({ msg: "No block found" });
          } else {
            const ops = [Aerospike.operations.write("name", value.name)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve(result);
              }
            });
          }
        }
      });
    });
  }

  async getGroupMembers(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      client.exists(key, async (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!data) {
            return res.status(400).json({ msg: "Group does not exists" });
          } else {
            const key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP,
              id
            );

            let query = client.query(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP
            );
            const tempBin = "ExpVar"; // this bin is to hold expression read operation output
            query.select(["g_mem"]); //select single bin
            query.where(Aerospike.filter.equal("g_id", id));

            // const queryPolicy = new Aerospike.QueryPolicy({});
            const stream = query.foreach();
            var temp = [];

            stream.on("data", async function (record) {
              const arr = record.bins.g_mem;
              for (let i = 0; i < arr.length; i++) {
                temp.push({
                  key: new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_USERS,
                    arr[i]
                  ),
                  type: batchType.BATCH_READ,
                  readAllBins: false,
                  bins: ["handleUn", "fn", "ln", "profilePic"],
                });
              }
            });

            stream.on("end", async function (posts) {
              console.log(temp);
              client.batchRead(temp, async (err, results) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  // console.log(results)
                  resolve(results);
                }
              });
            });
          }
        }
      });
    });
  }

  async addToGroupAsAdmin(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        id
      );
      const result = await client.get(key);

      if (result.bins.admins.includes(data.username)) {
        const ops = [Aerospike.lists.removeByValue("admins", data.username)];

        client.operate(key, ops, async (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            console.log("REMOVE");
            return { msg: "Remove from amnin" };
          }
        });
      } else {
        const ops = [Aerospike.lists.append("admins", data.username)];

        client.operate(key, ops, async (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            console.log("ADD");
            resolve({ msg: "Add as amnin" });
          }
        });
      }
    });
  }
}

module.exports = new BlockModal();
