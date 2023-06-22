/** @format */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const Multer = require("multer");
const uuid = require("uuid");
const uuidv1 = uuid.v1;
const { Storage } = require("@google-cloud/storage");
const { default: mongoose } = require("mongoose");
const { config } = require("dotenv");
const sharp = require("sharp");
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");
const maps = Aerospike.maps;
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");
const { uploadImage } = require("../helper/uploadImage");

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
    fileSize: 500 * 1024 * 1024,
  },
});
const bucket = storage.bucket("dexbros_files");

class BlockPostModal {
  constructor() {}

  async fetchBlockFeedPosts(page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS
      );

      var stream = query.foreach();
      var arr = [];
      stream.on("data", async (data) => {
        arr.push(data.bins);
      });

      stream.on("end", function (posts) {
        console.log("Page: ", page);
        var temp = arr.sort((a, b) => a.c_t - b.c_t);
        var start = (page - 1) * limit;
        var end = page * limit;
        if (page <= limit) {
          temp = temp.slice(start, end);
          resolve({ posts: temp });
        } else {
          resolve({ posts: [] });
        }
      });
    });
  }

  async createBlockPost(file, id, body, user) {
    var publicURL;
    if (file) {
      console.log("File >>", file);
      const result = await uploadImage(file);
      console.log(result);
      publicURL = result;
    }
    const batchType = Aerospike.batchType;
    const post_id = now.micro();
    const client = await getAerospikeClient();
    const oldString = body.content
      .trim()
      .replace(/(\r\n|\n|\r|(  ))/gm, " ")
      .split(" ");
    const newString = removeStopwords(oldString, eng);
    const post_content = body.content ? body.content : "";
    const post_gif = body.gif ? body.gif : "";

    // *** Create post key (FEED)
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POSTS,
      post_id.toString()
    );
    // *** Create post key (MAIN)
    const main_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_GROUP_POST,
      post_id.toString()
    );
    // *** Creating post meta key
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_META,
      post_id
    );
    const post_counter_ops = [
      Aerospike.operations.incr("cc", 1),
      Aerospike.operations.read("cc"),
    ];
    // const counterData = await client.operate(post_testmp_key, post_counter_ops);
    // *** Poct comment table
    const post_comment = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT,
      post_id.toString()
    );

    // *** Group meta
    const group_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_META,
      id
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});

    // **** Here we generate keys for SEARCHING post
    var dstring = newString;
    // console.log(newString)
    var keys = [];
    for (let i = 0; i < dstring.length; i++) {
      var sstr = dstring[i];
      keys.push(
        new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.POST_SEARCH,
          sstr
        )
      );
    }
    var batchArrKeys = [
      post_key,
      post_meta_key,
      keys,
      post_comment,
      main_post_key,
      group_meta_key,
    ];

    var batchRecords = [];
    for (let i = 0; i < batchArrKeys.length; i++) {
      // *** Posts
      if (batchArrKeys[i].set === process.env.SET_GROUP_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("p_id", post_id), // user post list
            Aerospike.operations.write("likes", 0), // group post likes
            Aerospike.operations.write("book", []), // group post bookmark
            Aerospike.operations.write("pinned", false), // group post pinned
            Aerospike.operations.write("content", body.content), // post content
            Aerospike.operations.write("gif", body.gif), // post gif
            Aerospike.operations.write("likes", 0),
            Aerospike.operations.write("u_id", user.u_id.toString()), //post userID
            Aerospike.operations.write("u_fn", user.fn), //first name
            Aerospike.operations.write("u_ln", user.ln), //lastname
            Aerospike.operations.write("u_dun", user.handleUn), //handleun
            Aerospike.operations.write("u_img", user.p_i),
            Aerospike.operations.write("hide", []), //group post hide
            Aerospike.operations.write("timestamp", Date.now()), //group post timestamp hide
            Aerospike.operations.write("spam", 0), //post spam count
            Aerospike.operations.write("c_t", new Date().getTime().toString()),
            Aerospike.operations.write("u_t", new Date().getTime().toString()),
            Aerospike.operations.write("comments", []), //post comment list
            Aerospike.operations.write("url", ""),
            Aerospike.operations.write("group_id", id.toString()),
            Aerospike.operations.write("shares", 0), //post share count
            Aerospike.operations.write("tran_cnt", 0),
            Aerospike.operations.write("isEvent", false),
            Aerospike.operations.write("isReposted", false),
            Aerospike.operations.write("deleted", false),
            Aerospike.operations.write("is_share", false),
            Aerospike.operations.write("c_c", 0),
            Aerospike.operations.write("l_c", 0),
            Aerospike.operations.write("statusText", body.statusText),
            Aerospike.operations.write("userLocation", body.userLocation),
            Aerospike.operations.write("image", publicURL || ""),
          ],
        });
      } else if (batchArrKeys[i].set === process.env.SET_MAIN_GROUP_POST) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("p_id", post_id), // user post list
            Aerospike.operations.write("likes", 0), // group post likes
            Aerospike.operations.write("book", []), // group post bookmark
            Aerospike.operations.write("pinned", false), // group post pinned
            Aerospike.operations.write("content", body.content), // post content
            Aerospike.operations.write("timestamp", Date.now()), //group post timestamp hide
            Aerospike.operations.write("gif", body.gif), // post gif
            Aerospike.operations.write("likes", 0),
            Aerospike.operations.write("u_id", user.u_id.toString()), //post userID
            Aerospike.operations.write("u_fn", user.fn), //first name
            Aerospike.operations.write("u_ln", user.ln), //lastname
            Aerospike.operations.write("u_dun", user.handleUn), //handleun
            Aerospike.operations.write("u_img", user.p_i),
            Aerospike.operations.write("hide", []), //group post hide
            Aerospike.operations.write("spam", 0), //post spam count
            Aerospike.operations.write("c_t", new Date().getTime().toString()),
            Aerospike.operations.write("u_t", new Date().getTime().toString()),
            Aerospike.operations.write("comments", []), //post comment list
            Aerospike.operations.write("url", ""),
            Aerospike.operations.write("group_id", id.toString()),
            Aerospike.operations.write("shares", 0), //post share count
            Aerospike.operations.write("tran_cnt", 0),
            Aerospike.operations.write("isReposted", false),
            Aerospike.operations.write("deleted", false),
            Aerospike.operations.write("is_share", false),
            Aerospike.operations.write("c_c", 0),
            Aerospike.operations.write("l_c", 0),
          ],
        });
      }
      // *** Group post meta
      else if (batchArrKeys[i].set === process.env.SET_GROUP_POST_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("p_id", post_id),
            Aerospike.operations.write("heart", []),
            Aerospike.operations.write("haha", []),
            Aerospike.operations.write("angry", []),
            Aerospike.operations.write("dislikes", []),
            Aerospike.operations.write("spam", []),
            Aerospike.operations.write("share", []),
          ],
        });
      }

      // *** Group post comment
      else if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("pid", post_id), // user post list
          ],
        });
      }
      // *** Save posts id in group meta data
      else if (batchArrKeys[i].set === process.env.SET_GROUP_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.lists.append("posts", post_id), // user post list
          ],
        });
      }

      // *** Group post search
      else if (Array.isArray(batchArrKeys[i])) {
        if (batchArrKeys[i].length > 0) {
          if (batchArrKeys[i][0].set === process.env.SET_POSTS_SEARCH) {
            let batchPolicy = new Aerospike.BatchPolicy({});
            let exists = await client.batchExists(batchArrKeys[i], batchPolicy);
            exists.forEach(async (result) => {
              var pk_word = result.record.key.key; //primary key
              var shortKey = pk_word.slice(0, 2).toLowerCase();
              // var timestmp = new Date().getTime().toString()
              var pid = `${post_id}`; //post id to append
              if (query.flwr_count > 0) {
                console.log("Celb");
                if (result.status !== 0) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: result.record.key,
                    ops: [
                      Aerospike.operations.write("p_k", pk_word),
                      Aerospike.operations.write("f_t", shortKey),
                      Aerospike.operations.write("celb_c", 1),
                      Aerospike.lists.append("celb_p_l", pid), // user post list
                    ],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: result.record.key,
                    ops: [
                      //if exists, append
                      Aerospike.lists.append("celb_p_l", pid),
                      Aerospike.operations.incr("celb_c", 1),
                    ],
                  });
                }
              } else {
                console.log("Normal");
                if (result.status !== 0) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: result.record.key,
                    ops: [
                      Aerospike.operations.write("p_k", pk_word),
                      Aerospike.operations.write("f_t", shortKey),
                      Aerospike.operations.write("u_c", 1),
                      Aerospike.lists.append("u_p_l", pid), // user post list
                    ],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: result.record.key,
                    ops: [
                      //if exists, append
                      Aerospike.lists.append("u_p_l", pid),
                      Aerospike.operations.incr("u_c", 1),
                    ],
                  });
                }
              }
            });
          }
        }
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      var getPostData = await client.get(post_key);
      return getPostData.bins;
    } catch (err) {
      throw createError.Conflict({ msg: err.message });
    }
  }

  async blockFetchFullPost(id) {
    const client = await getAerospikeClient();
    if (!id) {
      throw createError.BadRequest("Invalid");
    } else {
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS,
        id
      );

      const data = await client.get(key);
      try {
        return data.bins;
      } catch (err) {
        throw createError.BadRequest(err.message);
      }
    }
  }

  async fetchBlockPost(id, page, limit, sortedBy) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS
      );

      var stream = query.foreach();
      var arr = [];
      stream.on("data", async (data) => {
        // console.log(data.bins);
        if (data.bins.group_id === id.toString()) {
          const metaDataKey = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_GROUP_POSTS_ANALYTICS,
            data.bins.p_id
          );
          // const metaData = await client.get(metaDataKey);
          // const postData = {...data.bins, ...metaData.bins}
          // arr.push({...data.bins, ...metaData.bins});
          // console.log(data.bins.p_id);
          arr.push(data.bins);
        }
      });

      stream.on("end", function (posts) {
        if (sortedBy === "old") {
          var temp = arr.sort((a, b) => a.c_t - b.c_t);
          // var page = req.query.page || 1;
          // var limit = req.query.limit || 10;
          var results = [];
          var start = (page - 1) * limit;
          var end = page * limit;
          if (page <= limit) {
            temp = temp.slice(start, end);
          }
          resolve({ posts: temp });
        } else if (sortedBy === "popular") {
          var temp = arr.sort((a, b) => b.l_c - a.l_c);
          // var page = req.query.page || 1;
          // var limit = req.query.limit || 10;
          var results = [];
          var start = (page - 1) * limit;
          var end = page * limit;
          if (page <= limit) {
            temp = temp.slice(start, end);
          }
          resolve({ posts: temp });
        } else {
          var temp = arr.sort((a, b) => b.c_t - a.c_t);
          // var page = req.query.page || 1;
          // var limit = req.query.limit || 10;
          var results = [];
          var start = (page - 1) * limit;
          var end = page * limit;
          if (page <= limit) {
            temp = temp.slice(start, end);
          }
          resolve({ posts: temp });
        }
      });
    });
  }

  async blockPostLike(id, user) {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_META,
      id
    );

    const post = await client.get(post_key);
    if (post.bins.l_c > 0) {
      const meta = await client.get(post_meta_key);
      if (meta.bins.dislikes.includes(user.handleUn)) {
        const ops = [Aerospike.lists.removeByValue("dislikes", user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            const ops = [
              Aerospike.operations.incr("l_c", -1),
              Aerospike.operations.incr("dislike", 1),
            ];
            client.operate(post_key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                // return  ({ msg: "Dislikes added" });
                if (meta.bins.haha.length === 1) {
                  const ops = [Aerospike.operations.incr("haha", -1)];
                  const data = await client.operate(post_key, ops);
                  return { msg: "remove haha post" };
                } else {
                  return { msg: "remove haha post" };
                }
              }
            });
          }
        });
      } else {
        if (
          meta.bins.likes.includes(user.handleUn) ||
          meta.bins.haha.includes(user.handleUn) ||
          meta.bins.angry.includes(user.handleUn) ||
          meta.bins.dislikes.includes(user.handleUn)
        ) {
          const ops = [
            Aerospike.lists.removeByValue("likes", user.handleUn),
            Aerospike.lists.removeByValue("haha", user.handleUn),
            Aerospike.lists.removeByValue("angry", user.handleUn),
            Aerospike.lists.removeByValue("heart", user.handleUn),
          ];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              const ops = [Aerospike.lists.append("dislikes", user.handleUn)];
              client.operate(post_meta_key, ops, async (err, result) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  // return  ({ msg: "Dislike post" });
                  if (meta.bins.dislikes.length === 0) {
                    const ops = [Aerospike.operations.incr("dislike", 1)];
                    const data = await client.operate(post_key, ops);
                    // return  ({ msg: "Dislikes added" });

                    if (post.bins.u_dun === user.handleUn) {
                      return { msg: "Dislike post" };
                    } else {
                      if (user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: user.handleUn,
                              pic: user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return { msg: "Dislike post" };
                        } else {
                          return { msg: "Dislike post" };
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: user.handleUn,
                              pic: user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return { msg: "Dislike post" };
                        } else {
                          return { msg: "Dislike post" };
                        }
                      }
                    }
                  } else {
                    // return  ({ msg: "Dislikes added" });
                    if (post.bins.u_dun === user.handleUn) {
                      return { msg: "Dislike post" };
                    } else {
                      if (user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: user.handleUn,
                              pic: user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return { msg: "Dislike post" };
                        } else {
                          return { msg: "Dislike post" };
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: user.handleUn,
                              pic: user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return { msg: "Dislike post" };
                        } else {
                          return { msg: "Dislike post" };
                        }
                      }
                    }
                  }
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("dislikes", user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              const ops = [
                Aerospike.operations.incr("l_c", 1),
                Aerospike.operations.incr("dislikes", 1),
              ];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  // return  ({ msg: "Dislikes added" });
                  if (meta.bins.dislikes.length === 0) {
                    const ops = [Aerospike.operations.incr("dislike", 1)];
                    const data = await client.operate(post_key, ops);
                    return { msg: "Dislikes added" };
                  } else {
                    return { msg: "Dislikes added" };
                  }
                }
              });
            }
          });
        }
      }
    } else {
      const ops = [Aerospike.lists.append("dislikes", user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const ops = [Aerospike.operations.incr("l_c", 1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              // return  ({ msg: "Dislikes added" });
              if (meta.bins.dislikes.length === 0) {
                const ops = [Aerospike.operations.incr("dislike", 1)];
                const data = await client.operate(post_key, ops);
                // return  ({ msg: "Dislikes added" });

                if (post.bins.u_dun === user.handleUn) {
                  return { msg: "Dislike post" };
                } else {
                  if (user.flwr_c > 2) {
                    console.log("Popular");
                    if (post.bins.pop.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("pop", {
                          handleUn: user.handleUn,
                          pic: user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return { msg: "Dislike post" };
                    } else {
                      return { msg: "Dislike post" };
                    }
                  } else {
                    console.log("Normal");
                    if (post.bins.ran.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("ran", {
                          handleUn: user.handleUn,
                          pic: user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return { msg: "Dislike post" };
                    } else {
                      return { msg: "Dislike post" };
                    }
                  }
                }
              } else {
                // return  ({ msg: "Dislikes added" });
                if (post.bins.u_dun === user.handleUn) {
                  return { msg: "Liked post" };
                } else {
                  if (user.flwr_c > 2) {
                    console.log("Popular");
                    if (post.bins.pop.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("pop", {
                          handleUn: user.handleUn,
                          pic: user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return { msg: "Dislike post" };
                    } else {
                      return { msg: "Dislike post" };
                    }
                  } else {
                    console.log("Normal");
                    if (post.bins.ran.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("ran", {
                          handleUn: user.handleUn,
                          pic: user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return { msg: "Dislike post" };
                    } else {
                      return { msg: "Dislike post" };
                    }
                  }
                }
              }
            }
          });
        }
      });
    }
  }

  async blockPinnedPost(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_MAIN_GROUP_POST,
        id
      );
      const post_feed_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS,
        id
      );
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_MAIN_GROUP_POST
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      query.select(["pinned"]); //select single bin
      query.where(Aerospike.filter.equal("p_id", id));
      const stream = query.foreach();

      stream.on("data", async function (record) {
        if (record.bins.pinned) {
          const ops = [Aerospike.operations.write("pinned", false)];
          await client.operate(post_key, ops);
          try {
            await client.operate(post_feed_key, ops);
          } catch (error) {
            throw createError.BadRequest(err.message);
          }
        } else {
          const ops = [Aerospike.operations.write("pinned", true)];
          await client.operate(post_key, ops);
          try {
            await client.operate(post_feed_key, ops);
          } catch (error) {
            throw createError.BadRequest(err.message);
          }
        }
      });

      stream.on("end", async function (posts) {
        var postData = await client.get(post_key);
        console.log(postData.bins);
        resolve(postData.bins);
      });
    });
  }

  async blockPostDelete(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();

      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_MAIN_GROUP_POST,
        id
      );
      const post_feed_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS,
        id
      );

      client
        .exists(post_key)
        .then((data) => {
          const ops = [Aerospike.operations.write("deleted", true)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              client.operate(post_feed_key, ops, (err, result) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  resolve({ msg: "Post deleted", result: result.bins });
                }
              });
            }
          });
        })
        .catch((err) => {
          throw createError.BadRequest(err.message);
        });
    });
  }

  async blockPostEdit(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS,
        id
      );
      const ops = [Aerospike.operations.write("content", data.content)];
      client.operate(key, ops, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const post = await client.get(key);
          const result = post.bins;
          console.log("***** ", result);
          resolve(result);
        }
      });
    });
  }

  async blockPostSpam(id, handleUn) {
    const client = await getAerospikeClient();
    var post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_GROUP_POST,
      id
    );
    var post_feed_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_META,
      id
    );
    const meta_data = await client.get(post_meta_key);
    if (meta_data.bins.spam.includes(handleUn)) {
      const ops = [Aerospike.lists.removeByValue("spam", handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const ops = [Aerospike.operations.incr("spam", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              client.operate(post_feed_key, ops, (err, result) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  return result;
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("spam", handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const ops = [Aerospike.operations.incr("spam", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              client.operate(post_feed_key, ops, (err, result) => {
                if (err) {
                  throw createError.BadRequest(err.message);
                } else {
                  return result;
                }
              });
            }
          });
        }
      });
    }
  }

  async blockPostDonate(id, query, user) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_META,
        id
      );
      client.exists(post_meta_key, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!result) {
            return res.status(400).json({ msg: "No post found" });
          } else {
            // ** Generating time stamp
            const time = Date.now().toString();
            let record = await client.get(post_meta_key);

            const bins = {
              id: time,
              amount: query.amount,
              s_name: `${user.fn} ${user.ln}`,
              s_handleUn: user.handleUn,
              s_pic: user.p_i || "",
              r_username: query.handleUn,
              postId: id,
              message: query.message || "",
            };
            const earn_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_EARNING,
              time
            );
            const user_meta_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_USER_META,
              query.handleUn
            );

            client.put(earn_key, bins, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                let record = await client.get(post_meta_key);
                if (record.bins.earn) {
                  console.log("Have ", record.bins.earn);
                  const ops = [
                    Aerospike.maps
                      .getByKey("earn", time)
                      .andReturn(Aerospike.maps.returnType.KEY_VALUE),
                  ];

                  client.operate(post_meta_key, ops, async (err, result) => {
                    if (err) {
                      throw createError.BadRequest(err.message);
                    } else {
                      if (result.bins.earn[0] === time) {
                        const value =
                          Number(result.bins.earn[1]) + Number(query.amount);

                        const ops = [
                          Aerospike.maps.put("earn", time, value, {
                            order: maps.order.KEY_ORDERED,
                          }),
                        ];
                        let data = await client.operate(post_meta_key, ops);
                        try {
                          resolve({ msg: "Success" });
                        } catch (error) {
                          throw createError.BadRequest(err.message);
                        }
                      } else {
                        const ops = [
                          Aerospike.maps.put("earn", time, query.amount, {
                            order: maps.order.KEY_ORDERED,
                          }),
                        ];
                        let result = await client.operate(post_meta_key, ops);
                        try {
                          let result = await client.operate(user_meta_key, ops);
                          try {
                            resolve({ msg: "Success" });
                          } catch (error) {
                            throw createError.BadRequest(err.message);
                          }
                        } catch (error) {
                          throw createError.BadRequest(err.message);
                        }
                      }
                    }
                  });
                } else {
                  const ops = [
                    Aerospike.maps.put("earn", time, query.amount, {
                      order: maps.order.KEY_ORDERED,
                    }),
                  ];
                  let result = await client.operate(post_meta_key, ops);
                  try {
                    let result = await client.operate(user_meta_key, ops);
                    try {
                      resolve({ msg: "Success" });
                    } catch (error) {
                      throw createError.BadRequest(err.message);
                    }
                  } catch (error) {
                    throw createError.BadRequest(err.message);
                  }
                }
              }
            });
          }
        }
      });
    });
  }

  async fetchAllLikeUsers(id, likeType) {
    const client = await getAerospikeClient();

    console.log(likeType);

    const group_posts_analytics_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_META,
      id
    );
    var data = await client.get(group_posts_analytics_key);
    // console.log("DATA: >> ", data.bins.dislikes);

    const dislikes = data.bins.dislikes;
    const angry = data.bins.angry;
    const haha = data.bins.haha;
    const likes = data.bins.likes;
    const arr = dislikes.concat(angry, haha, likes);

    var result = [];
    if (likeType === "all") {
      for (let i = 0; i < arr.length; i++) {
        let user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          arr[i]
        );
        const user_data = await client.get(user_key);
        result.push(user_data.bins);
      }
    } else if (likeType === "likes") {
      for (let i = 0; i < likes.length; i++) {
        let user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          likes[i]
        );
        const user_data = await client.get(user_key);
        result.push(user_data.bins);
      }
    } else if (likeType === "haha") {
      for (let i = 0; i < haha.length; i++) {
        let user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          haha[i]
        );
        const user_data = await client.get(user_key);
        result.push(user_data.bins);
      }
    } else if (likeType === "angry") {
      for (let i = 0; i < angry.length; i++) {
        let user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          angry[i]
        );
        const user_data = await client.get(user_key);
        result.push(user_data.bins);
      }
    } else {
      for (let i = 0; i < dislikes.length; i++) {
        let user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          dislikes[i]
        );
        const user_data = await client.get(user_key);
        result.push(user_data.bins);
      }
    }
    return { post_likes: result };
  }

  //**************** GROUP POST COMMENT **************//

  async fetchAllBlockComments(id, handleUn, sortedBy, page, limit) {
    console.log(sortedBy);
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        handleUn
      );
      const user_meta = await client.get(key);
      var arr = [];

      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT
      );
      query.where(Aerospike.filter.equal("postID", id));
      var stream = query.foreach();

      stream.on("data", function (record) {
        // arr.push(data.bins);
        if (handleUn !== record.bins.c_handleUn) {
          arr.push(record.bins);
        }
      });

      stream.on("end", function (posts) {
        if (sortedBy === "old") {
          var temp = arr.sort((a, b) => a.c_id - b.c_id);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else if (sortedBy === "pop ") {
          var temp = arr.sort((a, b) => a.l_c - b.l_c);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else {
          var temp = arr.sort((a, b) => b.c_id - a.c_id);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        }
      });
    });
  }

  async fetchMyBlockComments(id, handleUn, sortedBy, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        handleUn
      );
      const user_meta = await client.get(key);
      var arr = [];
      var sortedBy = sortedBy;

      var query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT
      );
      query.where(Aerospike.filter.equal("postID", id));
      var stream = query.foreach();

      stream.on("data", function (record) {
        // arr.push(data.bins);
        if (handleUn === record.bins.c_handleUn) {
          arr.push(record.bins);
        }
      });

      stream.on("end", function (posts) {
        if (sortedBy === "old") {
          var temp = arr.sort((a, b) => a.c_id - b.c_id);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else if (sortedBy === "pop ") {
          var temp = arr.sort((a, b) => b.l_c - a.l_c);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else {
          var temp = arr.sort((a, b) => b.c_id - a.c_id);
          // const page = req.query.page;
          // const limit = req.query.limit;
          // const sortedBy = req.query.sortedBy;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        }
      });
    });
  }

  async blockLikeComment(id, type, likeCount, username, user) {
    // console.log("USER >>> ", user);
    var batchRecords = [];
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT,
      id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT_META,
      id
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [post_comment_key, post_comment_meta_key];

    const commentData = await client.get(post_comment_key);
    const commentMetaData = await client.get(post_comment_meta_key);

    var commentOps;
    var commentMetaOps;

    if (type === "like") {
      console.log("## LIKE ##");
      if (commentData.bins.l_c > 0) {
        if (commentMetaData.bins.likes.includes(user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("likes", user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("likes", user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("likes", user.handleUn)];
      }
    } else if (type === "dislike") {
      if (commentData.bins.l_c > 0) {
        if (commentMetaData.bins.dislikes.includes(user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("dislikes", user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("dislikes", user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("dislikes", user.handleUn)];
      }
    } else if (type === "haha") {
      console.log("## HAHA ##");
      if (Number(likeCount) > 0) {
        if (commentMetaData.bins.haha.includes(user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("haha", user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("haha", user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("haha", user.handleUn)];
      }
    } else if (type === "angry") {
      if (Number(likeCount) > 0) {
        if (commentMetaData.bins.haha.includes(user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("angry", user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("angry", user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("angry", user.handleUn)];
      }
    }

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: commentOps,
        });
      } else {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: commentMetaOps,
        });
      }
    }

    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      console.log("Complete HERE ***");
      // return res.status(200).json({ msg: "Complete" });
      if (username !== user.handleUn) {
        const map_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_APP_HISTORY,
          username
        );
        const notificationData = {
          id: commentData.bins.postId,
          ty: 8,
          vi: false,
          wo: user.handleUn,
          ti: Date.now(),
          nm: `${user.fn} ${user.ln}`,
          pi: user.p_i,
          cat: 4,
          re: username,
        };
        const map_ops = [
          Aerospike.operations.write("n_id", username),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
        return {
          msg: `You reacted ${type} on this comment`,
          notificationData,
        };
      } else {
        return { msg: `You reacted ${type} on this comment` };
      }
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async blockRemoveLikeComment(id, handleUn) {
    /** @format */

    var batchRecords = [];
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT,
      id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT_META,
      id
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [post_comment_key, post_comment_meta_key];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("l_c", -1)],
        });
      } else {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.lists.removeByValue("likes", handleUn),
            Aerospike.lists.removeByValue("dislikes", handleUn),
            Aerospike.lists.removeByValue("haha", handleUn),
            Aerospike.lists.removeByValue("angry", handleUn),
          ],
        });
      }
    }

    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      return { msg: "Emoji reaction remove" };
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async blockDeleteComment(commentId) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT,
        commentId
      );

      client.exists(key, async (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          if (!data) {
            throw createError.BadRequest({ msg: "No comment found" });
          } else {
            const data = await client.get(key);
            const postId = data.bins.postID;
            const post_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_MAIN_GROUP_POST,
              postId
            );
            const post_ops = [Aerospike.operations.incr("c_c", -1)];
            const ops = [Aerospike.operations.write("delete", true)];
            client.operate(key, ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                client.operate(post_key, post_ops, (err, result) => {
                  if (err) {
                    throw createError.BadRequest(err.message);
                  } else {
                    resolve({ msg: "Comment has been deleted" });
                  }
                });
              }
            });
          }
        }
      });
    });
  }

  async editBlockComment(commentId, value) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT,
        commentId
      );

      client.exists(key, async (err, data) => {
        if (err) {
          throw createError.BadRequest({ msg: err.message });
        } else {
          if (!data) {
            throw createError.BadRequest({ msg: "No comment found" });
          } else {
            const ops = [Aerospike.operations.write("comment", value.message)];
            const data = await client.operate(key, ops);
            try {
              resolve({ msg: "Comment updated" });
            } catch (err) {
              throw createError.BadRequest({ msg: err.message });
            }
          }
        }
      });
    });
  }

  async createBlockPostComment(id, file, body, user) {
    return new Promise(async (resolve, reject) => {
      console.log(">>> CALL <<<");
      const comment_id = now.micro();
      let batchPolicy1 = new Aerospike.BatchPolicy({});
      var publicURL;
      if (file) {
        console.log("File >>", file);
        const result = await uploadImage(file);
        console.log(result);
        publicURL = result;
      }
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_MAIN_GROUP_POST,
        id
      );
      const post_feed_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POSTS,
        id
      );
      const post_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_META,
        id
      );

      const postData = await client.get(post_key);
      client.exists(post_key, async (err, data) => {
        if (err) {
          throw createError.Conflict({ msg: err.message });
        } else {
          if (!data) {
            throw createError.Conflict({ msg: "Post id not valid" });
          } else {
            const post_comment_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP_POST_COMMENT,
              comment_id
            );
            const post_comment_meta_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_GROUP_POST_COMMENT_META,
              comment_id
            );

            const batchType = Aerospike.batchType;
            var batchArrKeys = [
              post_comment_key,
              post_comment_meta_key,
              post_key,
              post_feed_key,
              post_meta_key,
            ];
            var batchRecords = [];
            for (let i = 0; i < batchArrKeys.length; i++) {
              if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("c_id", comment_id), // comment id
                    Aerospike.operations.write("comment", body.text),
                    Aerospike.operations.write("image", publicURL || ""),
                    Aerospike.operations.write("postID", id),
                    Aerospike.operations.write("l_c", 0), // Like count
                    Aerospike.operations.write("d_c", 0), // Dislike count
                    Aerospike.operations.write("s_c", 0), // Spam count
                    Aerospike.operations.write("reply", []), // Reply list
                    Aerospike.operations.write("hide", []), // Hide list
                    Aerospike.operations.write("pinn", false), // Pinn comment
                    Aerospike.operations.write("delete", false), // Delete comment
                    Aerospike.operations.write("timestamp", Date.now()), //group post timestamp hide
                    Aerospike.operations.write(
                      "c_t",
                      new Date().getTime().toString()
                    ), // Comment time
                    Aerospike.operations.write(
                      "u_t",
                      new Date().getTime().toString()
                    ), // Comment update time
                    Aerospike.operations.write("c_fn", user.fn),
                    Aerospike.operations.write("c_ln", user.ln),
                    Aerospike.operations.write("c_pic", user.p_i),
                    Aerospike.operations.write("c_handleUn", user.handleUn),
                  ],
                });
              } else if (
                batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT_META
              ) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [
                    Aerospike.operations.write("c_m_id", comment_id),
                    Aerospike.operations.write("like", []),
                    Aerospike.operations.write("dislike", []),
                    Aerospike.operations.write("spam", []),
                  ],
                });
              } else if (
                batchArrKeys[i].set === process.env.SET_MAIN_GROUP_POST
              ) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [Aerospike.operations.incr("c_c", 1)],
                });
              } else if (batchArrKeys[i].set === process.env.SET_GROUP_POSTS) {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [Aerospike.operations.incr("c_c", 1)],
                });
              } else {
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: batchArrKeys[i],
                  ops: [Aerospike.lists.append("cmnt", comment_id)],
                });
              }
            }
            const postedData = await client.batchWrite(
              batchRecords,
              batchPolicy1
            );
            const data = await client.get(post_comment_key);
            if (user.handleUn !== postData.bins.u_dun) {
              const map_key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_APP_HISTORY,
                postData.bins.u_dun
              );
              var notificationData = {
                id: id,
                ty: 7,
                vi: false,
                wo: user.handleUn,
                ti: Date.now(),
                nm: `${user.fn} ${user.ln}`,
                pi: user.p_i,
                cat: 1,
                re: postData.bins.u_dun,
              };
              const map_ops = [
                Aerospike.operations.write("n_id", postData.bins.u_dun),
                Aerospike.maps.put(
                  "notification",
                  Date.now(),
                  notificationData,
                  {
                    order: maps.order.KEY_ORDERED,
                  }
                ),
                Aerospike.operations.incr("count", 1),
              ];
              let result = await client.operate(map_key, map_ops);
              resolve({
                comment: data,
                notificationData: notificationData,
              });
            } else {
              resolve({ comment: data });
            }
          }
        }
      });
    });
  }

  // ******************* Events ******************* //

  async fetchAllEvents(id, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_EVENT
      );
      const tempBin = "ExpVar";
      query.where(Aerospike.filter.equal("b_id", id));

      // const queryPolicy = new Aerospike.QueryPolicy({});
      const stream = query.foreach();
      var temp = [];
      stream.on("data", async function (record) {
        temp.push(record.bins);
      });
      stream.on("end", async function (record) {
        // var page = req.query.page || 1;
        // var limit = req.query.limit || 3;
        var start = (page - 1) * limit;
        var end = page * limit;
        var count = 0;

        temp = temp.splice(start, end);
        resolve(temp);
      });
    });
  }

  async fetchSingleEvent(id) {
    var client = await getAerospikeClient();
    const event_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_EVENT,
      id
    );

    const data = await client.get(event_key);
    try {
      return data.bins;
    } catch (error) {
      throw createError.BadRequest(err.message);
    }
  }

  async blockEventDelete(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const event_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_EVENT,
        id
      );

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_EVENT
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      query.select(["delete"]); //select single bin
      query.where(Aerospike.filter.equal("e_id", id));

      // const queryPolicy = new Aerospike.QueryPolicy({});
      const stream = query.foreach();
      stream.on("data", async function (record) {
        var data = record.bins.delete;
        const ops = [Aerospike.operations.write("delete", true)];
        await client.operate(event_key, ops);
      });

      stream.on("end", async function (record) {
        resolve({ msg: "Event has been delete" });
      });
    });
  }

  async blockEventJoin(id, handleUn) {
    const client = await getAerospikeClient();
    const event_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_EVENT,
      id
    );
    const data = await client.get(event_key);
    const result = data.bins;
    if (result.j_u.includes(handleUn)) {
      const ops = [Aerospike.lists.removeByValue("j_u", handleUn)];
      client.operate(event_key, ops, (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          return { msg: "User remove" };
        }
      });
    } else {
      const ops = [Aerospike.lists.append("j_u", handleUn)];
      client.operate(event_key, ops, (err, data) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          return { msg: "User join" };
        }
      });
    }
  }

  async addEventInterest(id, user, value, array) {
    const client = await getAerospikeClient();
    var batchRecords = [];
    const batchType = Aerospike.batchType;

    const event_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_EVENT,
      id
    );
    console.log(array.includes(user.handleUn));
    var ops = array.includes(user.handleUn)
      ? [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
        ]
      : [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
          Aerospike.lists.append("i_u", user.handleUn),
        ];

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [event_key];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_BLOCK_EVENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: ops,
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      return { msg: "Event interested added" };
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async addEventNotInterest(id, user, value, array) {
    const client = await getAerospikeClient();
    var batchRecords = [];
    const batchType = Aerospike.batchType;

    const event_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_EVENT,
      id
    );
    console.log(array.includes(user.handleUn));
    var ops = array.includes(user.handleUn)
      ? [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
        ]
      : [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
          Aerospike.lists.append("n_i_u", user.handleUn),
        ];

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [event_key];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_BLOCK_EVENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: ops,
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      return { msg: "Event not interested added" };
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async addEventJoin(id, user, value, array) {
    const client = await getAerospikeClient();
    var batchRecords = [];
    const batchType = Aerospike.batchType;

    const event_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_EVENT,
      id
    );
    console.log(array.includes(user.handleUn));
    var ops = array.includes(user.handleUn)
      ? [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
        ]
      : [
          Aerospike.lists.removeByValue("i_u", user.handleUn),
          Aerospike.lists.removeByValue("n_i_u", user.handleUn),
          Aerospike.lists.removeByValue("j_u", user.handleUn),
          Aerospike.lists.append("n_i_u", user.handleUn),
        ];

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [event_key];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_BLOCK_EVENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: ops,
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      return { msg: "Event join added" };
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  // ******************* Replies ******************* //
  async createBlockReply(id, data, user) {
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const reply_id = now.micro();

    const reply_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_BLOCK_COMMENT_REPLY,
      reply_id
    );

    const cmnt_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_GROUP_POST_COMMENT,
      id
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [];
    batchArrKeys = [reply_key, cmnt_key];
    var batchRecords = [];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_BLOCK_COMMENT_REPLY) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("r_id", reply_id),
            Aerospike.operations.write("content", data.replyText),
            Aerospike.operations.write("likes", []),
            Aerospike.operations.write("dislikes", []),
            Aerospike.operations.write("spam", []),
            Aerospike.operations.write("c_t", new Date().getTime().toString()),
            Aerospike.operations.write("u_t", new Date().getTime().toString()),
            Aerospike.operations.write("delete", false),
            Aerospike.operations.write("c_fn", user.fn),
            Aerospike.operations.write("c_ln", user.ln),
            Aerospike.operations.write("c_pi", user.p_i),
            Aerospike.operations.write("c_un", user.handleUn),
            Aerospike.operations.write("cmnt_id", id),
          ],
        });
      } else {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("c_c", 1)],
        });
      }
    }

    await client.batchWrite(batchRecords, batchPolicy1);
    const result = await client.get(reply_key);
    try {
      return result.bins;
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async getReplyes(id, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY
      );
      const tempBin1 = "ExpVar";
      // query.where(Aerospike.filter.equal("cmntId", req.params.id));
      const stream = query.foreach();
      var arr = [];

      stream.on("data", function (record) {
        if (record.bins.cmnt_id === id && !record.bins.delete) {
          arr.push(record.bins);
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        var start = (page - 1) * limit;
        var end = page * limit;
        var result = arr.slice(start, end);
        console.log(":", result);
        resolve(result);
      });
    });
  }

  async deleteBlockReply(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY,
        id
      );
      const data = await client.get(key);
      const cmnt_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT,
        data.bins.cmnt_id
      );

      const ops = [Aerospike.operations.write("delete", true)];
      client.operate(key, ops, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          console.log("Deleted");
          const ops = [Aerospike.operations.incr("c_c", -1)];
          client.operate(cmnt_key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              resolve({ msg: "Reply deleted" });
            }
          });
        }
      });
    });
  }

  async editBlockReply(id, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY,
        id
      );

      const ops = [Aerospike.operations.write("content", data.text)];
      client.operate(key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          resolve({ msg: "Reply updated" });
        }
      });
    });
  }

  async spamBlockReply(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY,
        id
      );
      const data = await client.get(key);
      if (data.bins.spam.includes(handleUn)) {
        const ops = [Aerospike.lists.removeByValue("spam", handleUn)];
        client.operate(key, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            resolve({ msg: "You unsapmmed this reply" });
          }
        });
      } else {
        const ops = [Aerospike.lists.append("spam", handleUn)];
        client.operate(key, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            resolve({ msg: "You sapmmed this reply" });
          }
        });
      }
    });
  }

  async likeBlockReply(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY,
        id
      );
      const data = await client.get(key);

      if (data.bins.dislikes.includes(handleUn)) {
        const ops = [
          Aerospike.lists.removeByValue("dislikes", handleUn),
          Aerospike.lists.append("likes", handleUn),
        ];
        client.operate(key, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            resolve({ msg: "you liked this reply" });
          }
        });
      } else {
        if (data.bins.likes.includes(handleUn)) {
          const ops = [Aerospike.lists.removeByValue("likes", handleUn)];
          client.operate(key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              resolve({ msg: "Remove like" });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("likes", handleUn)];
          client.operate(key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              resolve({ msg: "Add like" });
            }
          });
        }
      }
    });
  }

  async dislikeBlockReply(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_COMMENT_REPLY,
        id
      );
      const data = await client.get(key);

      if (data.bins.likes.includes(handleUn)) {
        const ops = [
          Aerospike.lists.removeByValue("likes", handleUn),
          Aerospike.lists.append("dislikes", handleUn),
        ];
        client.operate(key, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            resolve({ msg: "you disliked this reply" });
          }
        });
      } else {
        if (data.bins.dislikes.includes(handleUn)) {
          const ops = [Aerospike.lists.removeByValue("dislikes", handleUn)];
          client.operate(key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              resolve({ msg: "Remove dislike" });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("dislikes", handleUn)];
          client.operate(key, ops, (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              resolve({ msg: "Add dislike" });
            }
          });
        }
      }
    });
  }

  async createBlockEvent(file, body, user) {
    console.log("BODY: ", body);
    console.log("USER: ", user);

    // var publicURL;
    // if (file) {
    //   console.log("File >>", file);
    //   const result = await uploadImage(file);
    //   console.log(result);
    //   publicURL = result;
    // }
    // var batchRecords = [];
    // const batchType = Aerospike.batchType;
    // let batchPolicy1 = new Aerospike.BatchPolicy({});
    // const client = await getAerospikeClient();
    // const event_id = now.micro();
    // // console.log(body);
    // const result = new Date(body.startdate).getTime() - new Date().getTime();
    // var activity;
    // if (result < 0) {
    //   activity = false;
    // } else {
    //   activity = true;
    // }
    // const event_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_BLOCK_EVENT,
    //   event_id.toString()
    // );
    // const post_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP_POSTS,
    //   event_id.toString()
    // );
    // const group_meta_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP_META,
    //   body.blockId
    // );
    // var batchArrKeys = [post_key, event_key, group_meta_key];

    // for (let i = 0; i < batchArrKeys.length; i++) {
    //   if (batchArrKeys[i].set === process.env.SET_GROUP_POSTS) {
    //     batchRecords.push({
    //       type: batchType.BATCH_WRITE,
    //       key: batchArrKeys[i],
    //       ops: [
    //         Aerospike.operations.write("e_id", event_id),
    //         Aerospike.operations.write("tit", body.title),
    //         Aerospike.operations.write("eventimage", publicURL || ""),
    //         // Aerospike.operations.write("tit", body.title),
    //         Aerospike.operations.write("des", body.description),
    //         Aerospike.operations.write("type", body.type || ""),
    //         Aerospike.operations.write("link", body.link || ""),
    //         Aerospike.operations.write("s_d", body.startdate || ""),
    //         Aerospike.operations.write("e_d", body.enddate || ""),
    //         Aerospike.operations.write("city", body.city || ""),
    //         Aerospike.operations.write("country", body.country),
    //         Aerospike.operations.write("i_u", []),
    //         Aerospike.operations.write("n_i_u", []),
    //         Aerospike.operations.write("j_u", []),
    //         Aerospike.operations.write("price", body.price.toString()),
    //         Aerospike.operations.write("active", activity),
    //         Aerospike.operations.write("e_c_img", user.p_i),
    //         Aerospike.operations.write("e_c_fn", user.fn),
    //         Aerospike.operations.write("e_c_ln", user.ln),
    //         Aerospike.operations.write("e_c_dun", user.handleUn),
    //         Aerospike.operations.write("delete", false),
    //         Aerospike.operations.write("isEvent", true),
    //         Aerospike.operations.write("b_id", body.blockId),
    //       ],
    //     });
    //   } else if (batchArrKeys[i].set === process.env.SET_BLOCK_EVENT) {
    //     batchRecords.push({
    //       type: batchType.BATCH_WRITE,
    //       key: batchArrKeys[i],
    //       ops: [
    //         Aerospike.operations.write("e_id", event_id),
    //         Aerospike.operations.write("eventimage", publicURL),
    //         Aerospike.operations.write("tit", body.title),
    //         Aerospike.operations.write("des", body.description),
    //         Aerospike.operations.write("type", body.type),
    //         Aerospike.operations.write("link", body.link || ""),
    //         Aerospike.operations.write("s_d", body.startdate),
    //         Aerospike.operations.write("e_d", body.enddate),
    //         Aerospike.operations.write("city", body.city),
    //         Aerospike.operations.write("country", body.country),
    //         Aerospike.operations.write("i_u", []),
    //         Aerospike.operations.write("n_i_u", []),
    //         Aerospike.operations.write("j_u", []),
    //         Aerospike.operations.write("price", body.price.toString()),
    //         Aerospike.operations.write("active", activity),
    //         Aerospike.operations.write("e_c_img", user.p_i),
    //         Aerospike.operations.write("e_c_fn", user.fn),
    //         Aerospike.operations.write("e_c_ln", user.ln),
    //         Aerospike.operations.write("e_c_dun", user.handleUn),
    //         Aerospike.operations.write("delete", false),
    //         Aerospike.operations.write("b_id", body.blockId),
    //       ],
    //     });
    //   } else if (batchArrKeys[i].set === process.env.SET_GROUP_META) {
    //     batchRecords.push({
    //       type: batchType.BATCH_WRITE,
    //       key: batchArrKeys[i],
    //       ops: [Aerospike.lists.append("events", event_id)],
    //     });
    //   }
    // }
    // await client.batchWrite(batchRecords, batchPolicy1);
    // const data = await client.get(event_key);
    // try {
    //   return { msg: "Event created", event: data.bins };
    // } catch (err) {
    //   throw createError.Conflict({ msg: err.message });
    // }
  }
}

module.exports = new BlockPostModal();

// throw createError.BadRequest(err.message);

// return new Promise(async (resolve, reject) => {
