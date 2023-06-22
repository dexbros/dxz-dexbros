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

var createError = require("http-errors");
const {
  createNewBlock,
  blockupdateJoinPrivacy,
  blockUpdatePostPrivacy,
  blockUpdateEventPrivacy,
  blockUpdateDMPrivacy,
  BlockDetailsPrivacy,
  BlockMembersList,
  BlockNameUpdate,
  BlockUpdateName,
  changeBlockBioDetails,
  changeBlockCastBio,
  fetchRecomendedBlock,
  fetchMyBlockGroup,
  fetchMyJoinGroup,
  fetchFullSingleBlock,
  fetchSingleBlockAnalytics,
  FollowOneGroup,
  fetchSearchBlock,
  updatingBlocGroupName,
  getGroupMembers,
  addToGroupAsAdmin,
  updateBlockCoverImage,
  updateBlockProfileImage,
} = require("../model/blockModal");

class BlockController {
  constructor() {
    //
  }
  // Update Who can join block privacy settings
  async updateJoinPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        const data = await blockupdateJoinPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePostPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        const data = await blockUpdatePostPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatecreateEventPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, async (err, result) => {
        //   if (err) {
        //     throw createError.BadRequest("Invalid params");
        //   } else {
        //     if (!result) {
        //       throw createError.BadRequest("No group found");
        //     } else {
        //       const ops = [
        //         Aerospike.operations.write("eve_prv", req.body.event),
        //       ];
        //       client.operate(key, ops, async (err, result) => {
        //         if (err) {
        //           throw createError.BadRequest(err.message);
        //         } else {
        //           return res.status(200).json({ msg: "Group privacy updated" });
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await blockUpdateEventPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updatecreateDMPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, async (err, result) => {
        //   if (err) {
        //     throw createError.BadRequest("Invalid params");
        //   } else {
        //     if (!result) {
        //       throw createError.BadRequest("No group found");
        //     } else {
        //       const ops = [
        //         Aerospike.operations.write("dm_prv", req.body.dm_prv),
        //       ];
        //       client.operate(key, ops, async (err, result) => {
        //         if (err) {
        //           throw createError.BadRequest(err.message);
        //         } else {
        //           return res
        //             .status(200)
        //             .json({ msg: "Group DM privacy updated" });
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await blockUpdateDMPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateBlockDetailsPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, async (err, result) => {
        //   if (err) {
        //     throw createError.BadRequest("Invalid params");
        //   } else {
        //     if (!result) {
        //       throw createError.BadRequest("No group found");
        //     } else {
        //       const ops = [Aerospike.operations.write("view", req.body.view)];
        //       client.operate(key, ops, async (err, result) => {
        //         if (err) {
        //           throw createError.BadRequest(err.message);
        //         } else {
        //           return res
        //             .status(200)
        //             .json({ msg: "Group details privacy updated" });
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await BlockDetailsPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateBlockMembersListPrivacy(req, res, next) {
    const client = await getAerospikeClient();
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid params");
      } else {
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, async (err, result) => {
        //   if (err) {
        //     throw createError.BadRequest("Invalid params");
        //   } else {
        //     if (!result) {
        //       throw createError.BadRequest("No group found");
        //     } else {
        //       const ops = [
        //         Aerospike.operations.write("l_view", req.body.l_view),
        //       ];
        //       client.operate(key, ops, async (err, result) => {
        //         if (err) {
        //           throw createError.BadRequest(err.message);
        //         } else {
        //           return res
        //             .status(200)
        //             .json({ msg: "Group details privacy updated" });
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await BlockMembersList(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Create new block and blockcast
  async createBlock(req, res, next) {
    try {
      const data = await createNewBlock(req.user, req.body);
      console.log(">>>> ", data);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  // ***
  async updateBlockcastName(req, res, next) {
    try {
      const data = await BlockUpdateName(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateBlockBioDetails(req, res, next) {
    try {
      const data = await changeBlockBioDetails(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async updateBlockcastBio(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid format" });
      } else {
        const data = await changeBlockCastBio(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async blockRecomendation(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const data = await fetchRecomendedBlock(req.user.handleUn, page, limit);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchAllRecomendedGroup(req, res) {
    const client = await getAerospikeClient();
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
    // var query1 = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP_META);

    var stream = query.foreach();
    // var stream1 = query1.foreach();
    var arr = [];

    stream.on("data", async (data) => {
      if (!data.bins.g_mem.includes(req.user.handleUn)) {
        arr.push(data.bins);
      }
    });

    stream.on("end", function (posts) {
      // console.log(arr);
      return res.status(200).json(arr);
    });
  }

  async fetchMyBlocks(req, res, next) {
    // console.log("MY");
    // const client = await getAerospikeClient();
    // var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
    // // var query1 = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP_META);

    // var stream = query.foreach();
    // // var stream1 = query1.foreach();
    // var arr = [];

    // stream.on("data", async (data) => {
    //   if (data.bins.g_c_dun === req.user.handleUn) {
    //     arr.push(data.bins);
    //   }
    // });

    // stream.on("end", function (posts) {
    //   const temp = arr.sort((a, b) => b.g_id - a.g_id);
    //   return res.status(200).json(arr);
    // });
    try {
      const data = await fetchMyBlockGroup(req.user.handleUn);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchJoinBlock(req, res, next) {
    // const client = await getAerospikeClient();
    // var query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);

    // var stream = query.foreach();
    // // var stream1 = query1.foreach();
    // var arr = [];

    // stream.on("data", async (data) => {
    //   if (
    //     data.bins.g_mem.includes(req.user.handleUn) &&
    //     data.bins.g_c_dun !== req.user.handleUn
    //   ) {
    //     arr.push(data.bins);
    //   }
    // });

    // stream.on("end", function (posts) {
    //   // console.log(arr);
    //   return res.status(200).json(arr);
    // });
    try {
      const data = await fetchMyJoinGroup(req.user.handleUn);
      // console.log("DATA");
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchSingleBlock(req, res, next) {
    try {
      const data = await fetchFullSingleBlock(req.params.id);
      console.log(">>>");
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchBlockAnalytics(req, res, next) {
    // const client = await getAerospikeClient();
    // var group_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP,
    //   req.params.id
    // );
    // const group_data = await client.get(group_key);
    // try {
    //   var group_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_GROUP_META,
    //     req.params.id
    //   );
    //   const group_meta_data = await client.get(group_meta_key);
    //   // console.log(group_meta_data.bins);
    //   // const obj = { ...group_data.bins, ...group_meta_data.bins };
    //   return res
    //     .status(200)
    //     .json({ block: group_data.bins, meta: group_meta_data.bins });
    // } catch (err) {
    //   return res.status(401).json({ msg: err.message });
    // }
    try {
      const data = await fetchSingleBlockAnalytics(req.params.id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async uploadCoverImage(req, res) {
    const data = await updateBlockCoverImage(req.file, req.params.id);
    return res.status(200).json(data);
  }

  async joinBlock(req, res) {
    console.log("DATA ");
    const { groupId, userDisplayUsername } = req.body;
    if (!groupId || !userDisplayUsername) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const client = await getAerospikeClient();
      const group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        groupId
      );
      const data = await client.get(group_key);
      console.log("Group ", data.bins);
      if (!data.bins.g_mem.includes(userDisplayUsername)) {
        const group_ops = [
          Aerospike.lists.append("g_mem", userDisplayUsername),
        ];
        client.operate(group_key, group_ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "User added" });
          }
        });
      } else {
        const group_ops = [
          Aerospike.lists.removeByValue("g_mem", userDisplayUsername),
        ];
        const data = await client.operate(key, ops);
        client.operate(group_key, group_ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "User removed" });
          }
        });
      }
    }
  }

  async joinAsAdmin(req, res) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP,
      req.query.groupId
    );
    const data = await client.get(key);
    // console.log(req.query.handleUn)
    // console.log(data.bins.admins.includes(req.query.handleUn))
    if (data.bins.admins.includes(req.query.handleUn)) {
      // console.log("Admin");
      const ops = [Aerospike.lists.removeByValue("admins", req.query.handleUn)];
      client.operate(key, ops, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          return res
            .status(200)
            .json({ msg: "User remove from admin", group: data.bins });
        }
      });
    } else {
      // console.log(req.query.handleUn);
      const ops = [Aerospike.lists.append("admins", req.query.handleUn)];
      client.operate(key, ops, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          return res
            .status(200)
            .json({ msg: "User added to admin", group: data.bins });
        }
      });
    }
  }

  async addToHide(req, res) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP,
      req.query.groupId
    );
    const data = await client.get(key);
    const ops_1 = [Aerospike.lists.removeByValue("admins", req.query.handleUn)];
    client.operate(key, ops_1, (err, result) => {
      if (err) {
        return res.status(401).json({ msg: err.message });
      } else {
        if (data.bins.hide.includes(req.query.handleUn)) {
          // console.log("Admin");
          const ops = [
            Aerospike.lists.removeByValue("hide", req.query.handleUn),
          ];
          client.operate(key, ops, async (err, result) => {
            if (err) {
              return res.status(401).json({ msg: err.message });
            } else {
              return res
                .status(200)
                .json({ msg: "User remove from hide", group: data.bins });
            }
          });
        } else {
          // console.log(req.query.handleUn);
          const ops = [Aerospike.lists.append("hide", req.query.handleUn)];
          client.operate(key, ops, async (err, result) => {
            if (err) {
              return res.status(401).json({ msg: err.message });
            } else {
              return res
                .status(200)
                .json({ msg: "User added to hide", group: data.bins });
            }
          });
        }
      }
    });
  }

  /** */
  async removeFromGroupMember(req, res) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP,
      req.query.groupId
    );
    const data = await client.get(key);
    const ops_1 = [Aerospike.lists.removeByValue("admins", req.query.handleUn)];
    client.operate(key, ops_1, (err, result) => {
      if (err) {
        return res.status(401).json({ msg: err.message });
      } else {
        const ops = [
          Aerospike.lists.removeByValue("g_mem", req.query.handleUn),
        ];
        client.operate(key, ops, async (err, result) => {
          if (err) {
            return res.status(401).json({ msg: err.message });
          } else {
            return res
              .status(200)
              .json({ msg: "User remove from group", group: data.bins });
          }
        });
      }
    });
  }

  async blockProfilePicture(req, res) {
    const data = await updateBlockProfileImage(req.file, req.params.id);
    return res.status(200).json(data);
  }

  async unFollowGroup(req, res) {
    console.log("CALLL");
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      // remove user from moderator list

      const client = await getAerospikeClient();
      const group_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        req.params.id.toString()
      );
      const group_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_META,
        req.params.id.toString()
      );
      const group_ops = [Aerospike.operations.incr("g_mem", -1)];

      client.operate(group_key, group_ops, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          const data = await client.get(group_meta_key);
          const group_meta_ops = [
            Aerospike.lists.removeByValue("members", req.user._id.toString()),
          ];
          client.operate(
            group_meta_key,
            group_meta_ops,
            async (err, result) => {
              if (err) {
                return res.status(401).json({ msg: err.message });
              } else {
                console.log(result);
                const data = await client.get(group_key);
                return res.status(200).json(data.bins);
              }
            }
          );
        }
      });
    }
  }

  async followGroup(req, res) {
    console.log("HERE");
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      // const group_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP,
      //   req.params.id
      // );

      // let query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
      // const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // // query.select(["g_mem"]); //select single bin
      // query.where(Aerospike.filter.equal("g_id", req.params.id));
      // const stream = query.foreach();
      // stream.on("data", async function (record) {
      //   let arr = record.bins.g_mem;
      //   console.log(record.bins);
      //   if (arr.includes(req.user.handleUn)) {
      //     const ops = [
      //       Aerospike.lists.removeByValue("g_mem", req.user.handleUn),
      //     ];
      //     await client.operate(group_key, ops);
      //   } else {
      //     const ops = [Aerospike.lists.append("g_mem", req.user.handleUn)];
      //     await client.operate(group_key, ops);
      //     try {
      //       // *** save notification data
      //       const map_key = new Aerospike.Key(
      //         process.env.CLUSTER_NAME,
      //         process.env.SET_APP_HISTORY,
      //         record.bins.g_c_dun
      //       );
      //       const map_ops = [
      //         Aerospike.operations.write("n_id", record.bins.g_c_dun),
      //         Aerospike.maps.put(
      //           "notification",
      //           Date.now(),
      //           {
      //             id: req.user.handleUn,
      //             ty: 9,
      //             vi: false,
      //             wo: req.user.handleUn,
      //             ti: Date.now(),
      //             nm: `${req.user.fn} ${req.user.ln}`,
      //             pi: req.user.p_i,
      //             cat: 0,
      //           },
      //           {
      //             order: maps.order.KEY_ORDERED,
      //           }
      //         ),
      //         Aerospike.operations.incr("count", 1),
      //       ];
      //       let result = await client.operate(map_key, map_ops);
      //     } catch (error) {
      //       return res.status(400).json({ msg: error.message });
      //     }
      //   }
      // });

      // stream.on("end", async function (record) {
      //   // const data = await client.get(group_key);

      //   const cast_key = new Aerospike.Key(
      //     process.env.CLUSTER_NAME,
      //     process.env.SET_BLOCKCAST,
      //     req.params.id
      //   );
      //   const ops = [Aerospike.lists.append("mem", req.user.handleUn)];
      //   await client.operate(cast_key, ops);
      //   return res.status(200).json({ msg: "User added in the group" });
      // });
      const data = await FollowOneGroup(req.params.id, req.user);
      return res.status(200).json(data);
    }
  }

  async fetchMembers(req, res) {
    console.log("HERE");
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid postID" });
    } else {
      var key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        req.params.id
      );
      var data = await client.get(key);
      // console.log(data.bins.g_mem)
      var arr = [];
      for (let i = 0; i < data.bins.g_mem.length; i++) {
        var user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          data.bins.g_mem[i]
        );
        var user_data = await client.get(user_key);
        arr.push(user_data.bins);
      }
      try {
        // return res.status(200).json({ members: arr, group: data.bins });
      } catch (error) {
        return res.status(401).json({ msg: err.message });
      }
    }
  }

  async pinnedGroup(req, res) {
    const groupId = req.params.id;
    if (!groupId) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      var group = await Group.findById(groupId);
      var isPinned = group.pinned && group.pinned.includes(req.user._id);
      var option = isPinned ? "$pull" : "$addToSet";
      console.log(option);
      var group = await Group.findByIdAndUpdate(
        groupId,
        { [option]: { pinned: req.user._id } },
        { new: true }
      );

      try {
        return res.status(200).json(group);
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }

  async searchBlock(req, res, next) {
    // const client = await getAerospikeClient();
    // let query = client.query(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP_SEARCH
    // );
    // const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // const input_query = req.query.search;
    // const search_query = req.query.search.slice(0, 2);

    // console.log(input_query);

    // //truncated first two character

    // query.where(Aerospike.filter.equal("s_t", search_query)); //first filter out the result before applying expression regex query

    // const queryPolicy = new Aerospike.QueryPolicy({});

    // queryPolicy.filterExpression = exp.cmpRegex(
    //   Aerospike.regex.ICASE | Aerospike.regex.NEWLINE,
    //   "^" + input_query,
    //   exp.binStr("b_n")
    // );

    // var arr = [];
    // const stream = query.foreach(queryPolicy);
    // stream.on("data", function (record) {
    //   arr.push(record.bins);
    //   // console.log("*** Group Search List ***")
    //   // console.log(record.bins)
    // });
    // stream.on("end", function (posts) {
    //   // console.log(arr);
    //   return res.status(200).json({ block: arr });
    // });
    try {
      const data = await fetchSearchBlock(req.query.search);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async blockNameUpdate(req, res) {
    console.log("CALL");
    const name = req.body.name;
    if (!name.trim()) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request params" });
      } else {
        const client = await getAerospikeClient();
        const group_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP,
          req.params.id
        );
        const group_search_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP_SEARCH,
          req.params.id.toString()
        );
        client
          .exists(group_key)
          .then((data) => {
            if (!data) {
              return res.status(400).json({ msg: "No block found" });
            } else {
              const ops = [Aerospike.operations.write("g_n", name)];
              client.operate(group_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const group = await client.get(group_key);
                  const search_ops = [
                    Aerospike.operations.write("b_n", name),
                    Aerospike.operations.write(
                      "s_t",
                      name.toLowerCase().slice(0, 2)
                    ),
                  ];
                  client.operate(
                    group_search_key,
                    search_ops,
                    (err, result) => {
                      if (err) {
                        return res.status(400).json({ msg: err.message });
                      } else {
                        return res.status(200).json(group.bins);
                      }
                    }
                  );
                }
              });
            }
          })
          .catch((err) => {
            return res.status(501).json({ msg: err.message });
          });
      }
    }
  }

  async updateBlockBio(req, res) {
    const bio = req.body.bio;
    if (!bio.trim()) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request params" });
      } else {
        const client = await getAerospikeClient();
        const group_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP,
          req.params.id
        );
        client
          .exists(group_key)
          .then((data) => {
            if (!data) {
              return res.status(400).json({ msg: "No block found" });
            } else {
              const ops = [Aerospike.operations.write("g_bio", bio)];
              client.operate(group_key, ops, async (err, result) => {
                if (err) {
                  return res.status(200).json({ msg: err.message });
                } else {
                  const group = await client.get(group_key);
                  return res.status(200).json(group.bins);
                }
              });
            }
          })
          .catch((err) => {
            return res.status(501).json({ msg: err.message });
          });
      }
    }
  }

  async blockCatagoryList(rea, res) {
    const client = await getAerospikeClient();
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCKCAST_SEARCH
    );
    const stream = query.foreach();
    var results = [];

    stream.on("data", function (record) {
      results.push(record.bins);
    });

    stream.on("end", function (record) {
      return res.status(200).json(results);
    });
  }

  async updateBlockName(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid requrest" });
      } else {
        // const client = await getAerospikeClient();
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, (err, data) => {
        //   if (err) {
        //     return res.status(400).json({ msg: err.message });
        //   } else {
        //     if (!data) {
        //       return res.status(400).json({ msg: "No block found" });
        //     } else {
        //       const ops = [Aerospike.operations.write("g_n", req.body.name)];
        //       client.operate(key, ops, (err, result) => {
        //         if (err) {
        //           return res.status(400).json({ msg: err.message });
        //         } else {
        //           return res.status(200).json(result);
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await updatingBlocGroupName(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchBlockMembers(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Empty parametr" });
      } else {
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP,
        //   req.params.id
        // );
        // client.exists(key, async (err, data) => {
        //   if (err) {
        //     return res.status(400).json({ msg: err.message });
        //   } else {
        //     if (!data) {
        //       return res.status(400).json({ msg: "Group does not exists" });
        //     } else {
        //       const key = new Aerospike.Key(
        //         process.env.CLUSTER_NAME,
        //         process.env.SET_GROUP,
        //         req.params.id
        //       );
        //       let query = client.query(
        //         process.env.CLUSTER_NAME,
        //         process.env.SET_GROUP
        //       );
        //       const tempBin = "ExpVar"; // this bin is to hold expression read operation output
        //       query.select(["g_mem"]); //select single bin
        //       query.where(Aerospike.filter.equal("g_id", req.params.id));
        //       // const queryPolicy = new Aerospike.QueryPolicy({});
        //       const stream = query.foreach();
        //       var temp = [];
        //       stream.on("data", async function (record) {
        //         const arr = record.bins.g_mem;
        //         for (let i = 0; i < arr.length; i++) {
        //           temp.push({
        //             key: new Aerospike.Key(
        //               process.env.CLUSTER_NAME,
        //               process.env.SET_USERS,
        //               arr[i]
        //             ),
        //             type: batchType.BATCH_READ,
        //             readAllBins: false,
        //             bins: ["handleUn", "fn", "ln", "profilePic"],
        //           });
        //         }
        //       });
        //       stream.on("end", async function (posts) {
        //         console.log(temp);
        //         client.batchRead(temp, async (err, results) => {
        //           if (err) {
        //             return res.status(400).json({ msg: err.message });
        //           } else {
        //             // console.log(results)
        //             return res.status(200).json(results);
        //           }
        //         });
        //       });
        //     }
        //   }
        // });
        const data = await getGroupMembers(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchAdmins(req, res) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Empty parametr" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        req.params.id
      );
      client.exists(key, async (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "Group does not exists" });
          } else {
            const key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP,
              req.params.id
            );

            let query = client.query(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP
            );
            const tempBin = "ExpVar"; // this bin is to hold expression read operation output
            query.select(["admins"]); //select single bin
            query.where(Aerospike.filter.equal("g_id", req.params.id));

            // const queryPolicy = new Aerospike.QueryPolicy({});
            const stream = query.foreach();
            var temp = [];

            stream.on("data", async function (record) {
              const arr = record.bins.admins;
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
            });

            stream.on("end", async function (posts) {
              console.log(temp);
              client.batchRead(temp, async (err, results) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // console.log(results)
                  return res.status(200).json(results);
                }
              });
            });
          }
        }
      });
    }
  }

  async removeFromAdmin(req, res) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid requrest" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        req.params.id
      );
      client.exists(key, (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "No block found" });
          } else {
            const ops = [
              Aerospike.lists.removeByValue("admins", req.body.username),
            ];
            client.operate(key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json(result);
              }
            });
          }
        }
      });
    }
  }

  async fetchHideUsers(req, res) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Empty parametr" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP,
        req.params.id
      );
      client.exists(key, async (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "Group does not exists" });
          } else {
            const key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP,
              req.params.id
            );

            let query = client.query(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP
            );
            const tempBin = "ExpVar"; // this bin is to hold expression read operation output
            query.select(["hide"]); //select single bin
            query.where(Aerospike.filter.equal("g_id", req.params.id));

            // const queryPolicy = new Aerospike.QueryPolicy({});
            const stream = query.foreach();
            var temp = [];

            stream.on("data", async function (record) {
              const arr = record.bins.hide;
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
            });

            stream.on("end", async function (posts) {
              console.log(temp);
              client.batchRead(temp, async (err, results) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // console.log(results)
                  return res.status(200).json(results);
                }
              });
            });
          }
        }
      });
    }
  }

  async addToVisitors(req, res) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid requrest" });
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_META,
        req.params.id
      );
      client.exists(key, (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "No block found" });
          } else {
            let query = client.query(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP_META
            );
            const tempBin = "ExpVar";
            query.select("visitors");
            query.where(Aerospike.filter.equal("g_id", req.params.id));

            // const queryPolicy = new Aerospike.QueryPolicy({});
            const stream = query.foreach();
            var temp = [];
            stream.on("data", async function (record) {
              const ops = [
                Aerospike.lists.append("visitors", req.user.handleUn),
              ];
              client.operate(key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const groupKey = new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_GROUP,
                    req.params.id
                  );
                  const ops = [Aerospike.operations.incr("visitors", 1)];
                  client.operate(groupKey, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json(result);
                    }
                  });
                }
              });
            });
            stream.on("end", async function (record) {});
          }
        }
      });
    }
  }

  async addGroupAdmin(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid id");
      } else {
        const data = await addToGroupAsAdmin(req.params.id, req.body);
        console.log(data);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlockController();
