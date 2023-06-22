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
const createError = require("http-errors");
const {
  blockFetchFullPost,
  fetchBlockPost,
  blockPostLike,
  blockPinnedPost,
  blockPostDelete,
  blockPostEdit,
  blockPostSpam,
  blockPostDonate,
  fetchAllLikeUsers,
  fetchAllBlockComments,
  fetchMyBlockComments,
  blockLikeComment,
  blockRemoveLikeComment,
  blockDeleteComment,
  editBlockComment,
  fetchAllEvents,
  fetchSingleEvent,
  blockEventDelete,
  blockEventJoin,
  createBlockReply,
  getReplyes,
  deleteBlockReply,
  editBlockReply,
  spamBlockReply,
  likeBlockReply,
  dislikeBlockReply,
  createBlockPost,
  createBlockPostComment,
  createBlockEvent,
  addEventInterest,
  addEventNotInterest,
  addEventJoin,
  fetchBlockFeedPosts,
} = require("../model/blockPostModal");
const createHttpError = require("http-errors");

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

class BlockPostController {
  constructor() {}

  async blockFeed(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const data = await fetchBlockFeedPosts(page, limit);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // fetch group posts
  async fetchPosts(req, res) {
    console.log("CALL");
    const client = await getAerospikeClient();
    // var query = client.query(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP_POSTS
    // );
    if (!req.params.id) {
      return res.status(401).json({ msg: "Group id is not present" });
    } else {
      // console.log(req.params.id)
      // var stream = query.foreach();
      // var arr = [];
      // stream.on("data", async (data) => {
      //   // console.log(data.bins);
      //   if (data.bins.group_id === req.params.id.toString()) {
      //     const metaDataKey = new Aerospike.Key(
      //       process.env.CLUSTER_NAME,
      //       process.env.SET_GROUP_POSTS_ANALYTICS,
      //       data.bins.p_id
      //     );
      //     // const metaData = await client.get(metaDataKey);
      //     // const postData = {...data.bins, ...metaData.bins}
      //     // arr.push({...data.bins, ...metaData.bins});
      //     // console.log(data.bins.p_id);
      //     arr.push(data.bins);
      //   }
      // });
      // stream.on("end", function (posts) {
      //   if (req.query.sortedBy === "old") {
      //     var temp = arr.sort((a, b) => a.c_t - b.c_t);
      //     var page = req.query.page || 1;
      //     var limit = req.query.limit || 10;
      //     var results = [];
      //     var start = (page - 1) * limit;
      //     var end = page * limit;
      //     if (page <= limit) {
      //       temp = temp.slice(start, end);
      //     }
      //     return res.status(200).json({ posts: temp });
      //   } else if (req.query.sortedBy === "popular") {
      //     var temp = arr.sort((a, b) => b.l_c - a.l_c);
      //     var page = req.query.page || 1;
      //     var limit = req.query.limit || 10;
      //     var results = [];
      //     var start = (page - 1) * limit;
      //     var end = page * limit;
      //     if (page <= limit) {
      //       temp = temp.slice(start, end);
      //     }
      //     return res.status(200).json({ posts: temp });
      //   } else {
      //     var temp = arr.sort((a, b) => b.c_t - a.c_t);
      //     var page = req.query.page || 1;
      //     var limit = req.query.limit || 10;
      //     var results = [];
      //     var start = (page - 1) * limit;
      //     var end = page * limit;
      //     if (page <= limit) {
      //       temp = temp.slice(start, end);
      //     }
      //     return res.status(200).json({ posts: temp });
      //   }
      // });
      var page = req.query.page || 1;
      var limit = req.query.limit || 10;
      const data = await fetchBlockPost(
        req.params.id,
        page,
        limit,
        req.query.sortedBy
      );
      console.log("DATA: ", data);
      return res.status(200).json(data);
    }
  }

  // Post like ID
  async createPostLike(req, res) {
    console.log("EMOJI LIKE");
    const id = req.params.id;
    const client = await getAerospikeClient();
    console.log(req.params.id);
    if (!id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
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
        console.log("Like count greater than 0");
        const meta = await client.get(post_meta_key);
        if (meta.bins.likes.includes(req.user.handleUn)) {
          console.log("Already like");
          const ops = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.operations.incr("l_c", -1)];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  if (meta.bins.likes.length === 1) {
                    const ops = [Aerospike.operations.incr("like", -1)];
                    const data = await client.operate(post_key, ops);
                    return res.status(200).json({ msg: "remove Liked post" });
                  } else {
                    return res.status(200).json({ msg: "remove Liked post" });
                  }
                }
              });
            }
          });
        } else {
          console.log("Not like");
          if (
            meta.bins.haha.includes(req.user.handleUn) ||
            meta.bins.angry.includes(req.user.handleUn) ||
            meta.bins.dislikes.includes(req.user.handleUn)
          ) {
            console.log("Not like Other");
            const ops = [
              Aerospike.lists.removeByValue("haha", req.user.handleUn),
              Aerospike.lists.removeByValue("angry", req.user.handleUn),
              Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
            ];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [
                  Aerospike.lists.append("likes", req.user.handleUn),
                ];
                client.operate(post_meta_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    // return res.status(200).json({ msg: "You liked this post" });
                    if (meta.bins.likes.length === 0) {
                      const ops = [Aerospike.operations.incr("like", 1)];
                      const data = await client.operate(post_key, ops);

                      return res.status(200).json({ msg: "Liked post" });
                    } else {
                      return res.status(200).json({ msg: "Liked post" });
                    }
                  }
                });
              }
            });
          } else {
            const ops = [Aerospike.lists.append("likes", req.user.handleUn)];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("l_c", 1)];
                client.operate(post_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    // return res.status(200).json({ msg: "Liked post" });
                    if (meta.bins.likes.length === 0) {
                      const ops = [Aerospike.operations.incr("like", 1)];
                      const data = await client.operate(post_key, ops);
                      // return res.status(200).json({ msg: "Liked post" });
                      if (post.bins.u_dun === req.user.handleUn) {
                        return res.status(200).json({ msg: "Liked post" });
                      } else {
                        if (req.user.flwr_c > 2) {
                          console.log("Popular");
                          if (post.bins.pop.length <= 2) {
                            const ops = [
                              Aerospike.lists.append("pop", {
                                handleUn: req.user.handleUn,
                                pic: req.user.p_i || "",
                              }),
                            ];
                            const data = await client.operate(post_key, ops);
                            return res.status(200).json({ msg: "Liked post" });
                          } else {
                            return res.status(200).json({ msg: "Liked post" });
                          }
                        } else {
                          console.log("Normal");
                          if (post.bins.ran.length <= 2) {
                            const ops = [
                              Aerospike.lists.append("ran", {
                                handleUn: req.user.handleUn,
                                pic: req.user.p_i || "",
                              }),
                            ];
                            const data = await client.operate(post_key, ops);
                            return res.status(200).json({ msg: "Liked post" });
                          } else {
                            return res.status(200).json({ msg: "Liked post" });
                          }
                        }
                      }
                    } else {
                      // return res.status(200).json({ msg: "Liked post" });
                      if (post.bins.u_dun === req.user.handleUn) {
                        return res.status(200).json({ msg: "Liked post" });
                      } else {
                        if (req.user.flwr_c > 2) {
                          console.log("Popular");
                          if (post.bins.pop.length <= 2) {
                            const ops = [
                              Aerospike.lists.append("pop", {
                                handleUn: req.user.handleUn,
                                pic: req.user.p_i || "",
                              }),
                            ];
                            const data = await client.operate(post_key, ops);
                            return res.status(200).json({ msg: "Liked post" });
                          } else {
                            return res.status(200).json({ msg: "Liked post" });
                          }
                        } else {
                          console.log("Normal");
                          if (post.bins.ran.length <= 2) {
                            const ops = [
                              Aerospike.lists.append("ran", {
                                handleUn: req.user.handleUn,
                                pic: req.user.p_i || "",
                              }),
                            ];
                            const data = await client.operate(post_key, ops);
                            return res.status(200).json({ msg: "Liked post" });
                          } else {
                            return res.status(200).json({ msg: "Liked post" });
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
      } else {
        console.log("Like count 0");
        const ops = [Aerospike.lists.append("likes", req.user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [
              Aerospike.operations.incr("l_c", 1),
              Aerospike.operations.incr("like", 1),
            ];
            client.operate(post_key, ops, async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                // return res.status(200).json({ msg: "Liked post" });
                // ***
                if (post.bins.u_dun === req.user.handleUn) {
                  return res.status(200).json({ msg: "Liked post" });
                } else {
                  if (req.user.flwr_c > 2) {
                    console.log("Popular");
                    if (post.bins.pop.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("pop", {
                          handleUn: req.user.handleUn,
                          pic: req.user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return res.status(200).json({ msg: "Liked post" });
                    } else {
                      return res.status(200).json({ msg: "Liked post" });
                    }
                  } else {
                    console.log("Normal");
                    if (post.bins.ran.length <= 2) {
                      const ops = [
                        Aerospike.lists.append("ran", {
                          handleUn: req.user.handleUn,
                          pic: req.user.p_i || "",
                        }),
                      ];
                      const data = await client.operate(post_key, ops);
                      return res.status(200).json({ msg: "Liked post" });
                    } else {
                      return res.status(200).json({ msg: "Liked post" });
                    }
                  }
                }
              }
            });
          }
        });
      }
    }
  }

  async pinnedPost(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const data = await blockPinnedPost(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // view full post
  async viewFullPost(req, res, next) {
    // console.log("CALL");
    // const client = await getAerospikeClient();
    // if (!req.params.id) {
    //   return res.status(400).json({ msg: "Not found" });
    // } else {
    //   const key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_GROUP_POSTS,
    //     req.params.id
    //   );

    //   const data = await client.get(key);
    //   try {
    //     return res.status(200).json(data.bins);
    //   } catch (error) {
    //     return res.status(400).json({ msg: error.message });
    //   }
    // }
    try {
      const data = await blockFetchFullPost(req.params.id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req, res, next) {
    try {
      // const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(401).json({ msg: "Invalid request" });
      } else {
        const data = await blockPostDelete(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async editPost(req, res, next) {
    const client = await getAerospikeClient();
    // if (!req.params.id) {
    //   return res.status(401).json({ msg: "Invalid request" });
    // } else {
    //   if (!req.file) {
    //     const post_meta_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_GROUP_POST_META,
    //       req.params.id
    //     );
    //     const post_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_MAIN_GROUP_POST,
    //       req.params.id
    //     );
    //     const post_feed_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_GROUP_POSTS,
    //       req.params.id
    //     );

    //     let query = client.query(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_GROUP_POSTS
    //     );
    //     const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    //     query.select(["content", "gif"]); //select single bin
    //     query.where(Aerospike.filter.equal("p_id", req.params.id));

    //     const stream = query.foreach();
    //     stream.on("data", async function (record) {
    //       console.log(record);
    //       const ops = [
    //         Aerospike.operations.write("content", req.body.content),
    //         Aerospike.operations.write("gif", req.body.gif),
    //       ];
    //       await client.operate(post_key, ops);
    //       try {
    //         await client.operate(post_feed_key, ops);
    //       } catch (error) {
    //         return res.status(400).json({ msg: error.message });
    //       }
    //     });

    //     stream.on("end", async function (posts) {
    //       var postData = await client.get(post_key);
    //       // console.log(postData)
    //       res.status(200).json(postData.bins);
    //     });
    //   } else {
    //     const newImageName = uuidv1() + "-" + req.file.originalname;
    //     const blob = bucket.file(newImageName);
    //     const blobStream = blob.createWriteStream();
    //     blobStream.on("finish", async () => {
    //       var publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;

    //       const post_key = new Aerospike.Key(
    //         process.env.CLUSTER_NAME,
    //         process.env.SET_GROUP_POSTS,
    //         req.params.id
    //       );

    //       let query = client.query(
    //         process.env.CLUSTER_NAME,
    //         process.env.SET_GROUP_POSTS
    //       );
    //       const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    //       query.select(["content", "gif", "image"]); //select single bin
    //       query.where(Aerospike.filter.equal("p_id", req.params.id));

    //       const stream = query.foreach();
    //       stream.on("data", async function (record) {
    //         console.log(record);
    //         const ops = [
    //           Aerospike.operations.write("content", req.body.content),
    //           Aerospike.operations.write("gif", req.body.gif),
    //           Aerospike.operations.write("image", publicURL),
    //         ];
    //         await client.operate(post_key, ops);
    //       });

    //       stream.on("end", async function (posts) {
    //         var postData = await client.get(post_key);
    //         console.log(postData);
    //         res.status(200).json(postData.bins);
    //       });
    //     });
    //     blobStream.on("error", (err) => {
    //       console.log(err);
    //       return res.status(400).json({ msg: err.message });
    //     });
    //     blobStream.end(req.file.buffer);
    //   }
    // }

    const data = await blockPostEdit(req.params.id, req.body);
    // console.log(data);
    return res.status(200).json(data);
  }

  async spamPost(req, res, next) {
    const client = await getAerospikeClient();

    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      // var post_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_MAIN_GROUP_POST,
      //   req.params.id
      // );
      // var post_feed_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POSTS,
      //   req.params.id
      // );
      // const post_meta_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_META,
      //   req.params.id
      // );
      // const meta_data = await client.get(post_meta_key);
      // if (meta_data.bins.spam.includes(req.user.handleUn)) {
      //   const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
      //   client.operate(post_meta_key, ops, (err, result) => {
      //     if (err) {
      //       return res.status(400).json({ msg: err.message });
      //     } else {
      //       const ops = [Aerospike.operations.incr("spam", -1)];
      //       client.operate(post_key, ops, (err, result) => {
      //         if (err) {
      //           return res.status(400).json({ msg: err.message });
      //         } else {
      //           client.operate(post_feed_key, ops, (err, result) => {
      //             if (err) {
      //               return res.status(400).json({ msg: err.message });
      //             } else {
      //               return res.status(200).json(result);
      //             }
      //           });
      //         }
      //       });
      //     }
      //   });
      // } else {
      //   const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
      //   client.operate(post_meta_key, ops, (err, result) => {
      //     if (err) {
      //       return res.status(400).json({ msg: err.message });
      //     } else {
      //       const ops = [Aerospike.operations.incr("spam", 1)];
      //       client.operate(post_key, ops, (err, result) => {
      //         if (err) {
      //           return res.status(400).json({ msg: err.message });
      //         } else {
      //           client.operate(post_feed_key, ops, (err, result) => {
      //             if (err) {
      //               return res.status(400).json({ msg: err.message });
      //             } else {
      //               return res.status(200).json(result);
      //             }
      //           });
      //         }
      //       });
      //     }
      //   });
      // }
      const data = await blockPostSpam(req.params.id, req.user.handleUn);
      return res.status(200).json(data);
    }
  }

  async donatePost(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const id = req.params.id;
      console.log(req.query);
      if (!id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        // const post_meta_key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP_POST_META,
        //   id
        // );
        // client.exists(post_meta_key, async (err, result) => {
        //   if (err) {
        //     return res.status(400).json({ msg: err.message });
        //   } else {
        //     if (!result) {
        //       return res.status(400).json({ msg: "No post found" });
        //     } else {
        //       // ** Generating time stamp
        //       const time = Date.now().toString();
        //       let record = await client.get(post_meta_key);

        //       const bins = {
        //         id: time,
        //         amount: req.query.amount,
        //         s_name: `${req.user.fn} ${req.user.ln}`,
        //         s_handleUn: req.user.handleUn,
        //         s_pic: req.user.p_i || "",
        //         r_username: req.query.handleUn,
        //         postId: id,
        //         message: req.query.message || "",
        //       };
        //       const earn_key = new Aerospike.Key(
        //         process.env.CLUSTER_NAME,
        //         process.env.SET_EARNING,
        //         time
        //       );
        //       const user_meta_key = new Aerospike.Key(
        //         process.env.CLUSTER_NAME,
        //         process.env.SET_USER_META,
        //         req.query.handleUn
        //       );

        //       client.put(earn_key, bins, async (err, result) => {
        //         if (err) {
        //           return res.status(400).json({ msg: err.message });
        //         } else {
        //           let record = await client.get(post_meta_key);
        //           if (record.bins.earn) {
        //             console.log("Have ", record.bins.earn);
        //             const ops = [
        //               Aerospike.maps
        //                 .getByKey("earn", time)
        //                 .andReturn(Aerospike.maps.returnType.KEY_VALUE),
        //             ];

        //             client.operate(post_meta_key, ops, async (err, result) => {
        //               if (err) {
        //                 return res.status(400).json({ msg: err.message });
        //               } else {
        //                 if (result.bins.earn[0] === time) {
        //                   const value =
        //                     Number(result.bins.earn[1]) +
        //                     Number(req.query.amount);

        //                   const ops = [
        //                     Aerospike.maps.put("earn", time, value, {
        //                       order: maps.order.KEY_ORDERED,
        //                     }),
        //                   ];
        //                   let data = await client.operate(post_meta_key, ops);
        //                   try {
        //                     return res.status(200).json({ msg: "Success" });
        //                   } catch (error) {
        //                     return res.status(400).json({ msg: error.message });
        //                   }
        //                 } else {
        //                   const ops = [
        //                     Aerospike.maps.put("earn", time, req.query.amount, {
        //                       order: maps.order.KEY_ORDERED,
        //                     }),
        //                   ];
        //                   let result = await client.operate(post_meta_key, ops);
        //                   try {
        //                     let result = await client.operate(
        //                       user_meta_key,
        //                       ops
        //                     );
        //                     try {
        //                       return res.status(200).json({ msg: "Success" });
        //                     } catch (error) {
        //                       return res
        //                         .status(400)
        //                         .json({ msg: error.message });
        //                     }
        //                   } catch (error) {
        //                     return res.status(400).json({ msg: error.message });
        //                   }
        //                 }
        //               }
        //             });
        //           } else {
        //             const ops = [
        //               Aerospike.maps.put("earn", time, req.query.amount, {
        //                 order: maps.order.KEY_ORDERED,
        //               }),
        //             ];
        //             let result = await client.operate(post_meta_key, ops);
        //             try {
        //               let result = await client.operate(user_meta_key, ops);
        //               try {
        //                 return res.status(200).json({ msg: "Success" });
        //               } catch (error) {
        //                 return res.status(400).json({ msg: err.message });
        //               }
        //             } catch (error) {
        //               return res.status(400).json({ msg: error.message });
        //             }
        //           }
        //         }
        //       });
        //     }
        //   }
        // });
        const data = await blockPostDonate(id, req.query, req.user);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchLikeUser(req, res, next) {
    try {
      console.log("likeType ", req.query.type);
      const data = await fetchAllLikeUsers(req.params.id, req.query.type);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // ***************************** //

  // ***************************** //

  async handleDislike(req, res, next) {
    try {
      const id = req.params.id;
      const client = await getAerospikeClient();
      if (!id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
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
          if (meta.bins.dislikes.includes(req.user.handleUn)) {
            const ops = [
              Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
            ];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [
                  Aerospike.operations.incr("l_c", -1),
                  Aerospike.operations.incr("dislike", 1),
                ];
                client.operate(post_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    // return res.status(200).json({ msg: "Dislikes added" });
                    if (meta.bins.haha.length === 1) {
                      const ops = [Aerospike.operations.incr("haha", -1)];
                      const data = await client.operate(post_key, ops);
                      return res.status(200).json({ msg: "remove haha post" });
                    } else {
                      return res.status(200).json({ msg: "remove haha post" });
                    }
                  }
                });
              }
            });
          } else {
            if (
              meta.bins.likes.includes(req.user.handleUn) ||
              meta.bins.haha.includes(req.user.handleUn) ||
              meta.bins.angry.includes(req.user.handleUn) ||
              meta.bins.dislikes.includes(req.user.handleUn)
            ) {
              const ops = [
                Aerospike.lists.removeByValue("likes", req.user.handleUn),
                Aerospike.lists.removeByValue("haha", req.user.handleUn),
                Aerospike.lists.removeByValue("angry", req.user.handleUn),
                Aerospike.lists.removeByValue("heart", req.user.handleUn),
              ];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [
                    Aerospike.lists.append("dislikes", req.user.handleUn),
                  ];
                  client.operate(post_meta_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // return res.status(200).json({ msg: "Dislike post" });
                      if (meta.bins.dislikes.length === 0) {
                        const ops = [Aerospike.operations.incr("dislike", 1)];
                        const data = await client.operate(post_key, ops);
                        // return res.status(200).json({ msg: "Dislikes added" });

                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            }
                          }
                        }
                      } else {
                        // return res.status(200).json({ msg: "Dislikes added" });
                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Dislike post" });
                            }
                          }
                        }
                      }
                    }
                  });
                }
              });
            } else {
              const ops = [
                Aerospike.lists.append("dislikes", req.user.handleUn),
              ];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [
                    Aerospike.operations.incr("l_c", 1),
                    Aerospike.operations.incr("dislikes", 1),
                  ];
                  client.operate(post_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // return res.status(200).json({ msg: "Dislikes added" });
                      if (meta.bins.dislikes.length === 0) {
                        const ops = [Aerospike.operations.incr("dislike", 1)];
                        const data = await client.operate(post_key, ops);
                        return res.status(200).json({ msg: "Dislikes added" });
                      } else {
                        return res.status(200).json({ msg: "Dislikes added" });
                      }
                    }
                  });
                }
              });
            }
          }
        } else {
          const ops = [Aerospike.lists.append("dislikes", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.operations.incr("l_c", 1)];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // return res.status(200).json({ msg: "Dislikes added" });
                  if (meta.bins.dislikes.length === 0) {
                    const ops = [Aerospike.operations.incr("dislike", 1)];
                    const data = await client.operate(post_key, ops);
                    // return res.status(200).json({ msg: "Dislikes added" });

                    if (post.bins.u_dun === req.user.handleUn) {
                      return res.status(200).json({ msg: "Dislike post" });
                    } else {
                      if (req.user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          return res.status(200).json({ msg: "Dislike post" });
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          return res.status(200).json({ msg: "Dislike post" });
                        }
                      }
                    }
                  } else {
                    // return res.status(200).json({ msg: "Dislikes added" });
                    if (post.bins.u_dun === req.user.handleUn) {
                      return res.status(200).json({ msg: "Liked post" });
                    } else {
                      if (req.user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          return res.status(200).json({ msg: "Dislike post" });
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Dislike post" });
                        } else {
                          return res.status(200).json({ msg: "Dislike post" });
                        }
                      }
                    }
                  }
                }
              });
            }
          });
        }
        // const data = await blockPostLike(id, req.user);
        // return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async handleHaha(req, res) {
    try {
      const id = req.params.id;
      const client = await getAerospikeClient();
      console.log(req.params.id);
      if (!id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
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
          console.log("Like count greater than 0");
          const meta = await client.get(post_meta_key);
          if (meta.bins.haha.includes(req.user.handleUn)) {
            console.log("Already haha");
            const ops = [
              Aerospike.lists.removeByValue("haha", req.user.handleUn),
            ];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("l_c", -1)];
                client.operate(post_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    // return res.status(200).json({ msg: "remove haha post" });
                    if (meta.bins.haha.length === 1) {
                      const ops = [Aerospike.operations.incr("haha", -1)];
                      const data = await client.operate(post_key, ops);
                      return res.status(200).json({ msg: "remove haha post" });
                    } else {
                      return res.status(200).json({ msg: "remove haha post" });
                    }
                  }
                });
              }
            });
          } else {
            console.log("Not like");
            if (
              meta.bins.likes.includes(req.user.handleUn) ||
              meta.bins.angry.includes(req.user.handleUn) ||
              meta.bins.dislikes.includes(req.user.handleUn)
            ) {
              console.log("Not like Other");
              const ops = [
                Aerospike.lists.removeByValue("likes", req.user.handleUn),
                Aerospike.lists.removeByValue("angry", req.user.handleUn),
                Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
              ];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [
                    Aerospike.lists.append("haha", req.user.handleUn),
                  ];
                  client.operate(post_meta_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      if (meta.bins.haha.length === 0) {
                        const ops = [Aerospike.operations.incr("haha", 1)];
                        const data = await client.operate(post_key, ops);
                        // return res.status(200).json({ msg: "haha post" });
                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "HAHA post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res.status(200).json({ msg: "HAHA post" });
                            } else {
                              return res.status(200).json({ msg: "HAHA post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res.status(200).json({ msg: "HAHA post" });
                            } else {
                              return res.status(200).json({ msg: "HAHA post" });
                            }
                          }
                        }
                      } else {
                        // return res.status(200).json({ msg: "haha post" });

                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Liked post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res.status(200).json({ msg: "HAHA post" });
                            } else {
                              return res.status(200).json({ msg: "haha post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res.status(200).json({ msg: "haha post" });
                            } else {
                              return res.status(200).json({ msg: "haha post" });
                            }
                          }
                        }
                      }
                    }
                  });
                }
              });
            } else {
              const ops = [Aerospike.lists.append("haha", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("l_c", 1)];
                  client.operate(post_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      if (meta.bins.haha.length === 0) {
                        const ops = [Aerospike.operations.incr("haha", 1)];
                        const data = await client.operate(post_key, ops);
                        // return res.status(200).json({ msg: "haha post" });
                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Liked post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            }
                          }
                        }
                      } else {
                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Liked post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Liked post" });
                            }
                          }
                        }
                        return res.status(200).json({ msg: "haha post" });
                      }
                    }
                  });
                }
              });
            }
          }
        } else {
          console.log("Like count 0");
          const ops = [Aerospike.lists.append("haha", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [
                Aerospike.operations.incr("l_c", 1),
                Aerospike.operations.incr("haha", 1),
              ];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // return res.status(200).json({ msg: "HAHA post" });
                  if (post.bins.u_dun === req.user.handleUn) {
                    return res.status(200).json({ msg: "Liked post" });
                  } else {
                    if (req.user.flwr_c > 2) {
                      console.log("Popular");
                      if (post.bins.pop.length <= 2) {
                        const ops = [
                          Aerospike.lists.append("pop", {
                            handleUn: req.user.handleUn,
                            pic: req.user.p_i || "",
                          }),
                        ];
                        const data = await client.operate(post_key, ops);
                        return res.status(200).json({ msg: "Liked post" });
                      } else {
                        return res.status(200).json({ msg: "Liked post" });
                      }
                    } else {
                      console.log("Normal");
                      if (post.bins.ran.length <= 2) {
                        const ops = [
                          Aerospike.lists.append("ran", {
                            handleUn: req.user.handleUn,
                            pic: req.user.p_i || "",
                          }),
                        ];
                        const data = await client.operate(post_key, ops);
                        return res.status(200).json({ msg: "Liked post" });
                      } else {
                        return res.status(200).json({ msg: "Liked post" });
                      }
                    }
                  }
                }
              });
            }
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async handleAngry(req, res, next) {
    try {
      const id = req.params.id;
      const client = await getAerospikeClient();
      if (!id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
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
          if (meta.bins.angry.includes(req.user.handleUn)) {
            const ops = [
              Aerospike.lists.removeByValue("angry", req.user.handleUn),
            ];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("l_c", -1)];
                client.operate(post_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    // return res.status(200).json({ msg: "angry added" });
                    if (meta.bins.angry.length === 1) {
                      const ops = [Aerospike.operations.incr("angry", -1)];
                      const data = await client.operate(post_key, ops);
                      return res.status(200).json({ msg: "angry added" });
                    } else {
                      return res.status(200).json({ msg: "angry added" });
                    }
                  }
                });
              }
            });
          } else {
            if (
              meta.bins.likes.includes(req.user.handleUn) ||
              meta.bins.haha.includes(req.user.handleUn) ||
              meta.bins.angry.includes(req.user.handleUn) ||
              meta.bins.dislikes.includes(req.user.handleUn)
            ) {
              const ops = [
                Aerospike.lists.removeByValue("likes", req.user.handleUn),
                Aerospike.lists.removeByValue("haha", req.user.handleUn),
                Aerospike.lists.removeByValue("angry", req.user.handleUn),
                Aerospike.lists.removeByValue("heart", req.user.handleUn),
              ];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [
                    Aerospike.lists.append("angry", req.user.handleUn),
                  ];
                  client.operate(post_meta_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // return res.status(200).json({ msg: "Angry post" });
                      if (meta.bins.angry.length === 0) {
                        const ops = [Aerospike.operations.incr("angry", 1)];
                        const data = await client.operate(post_key, ops);
                        return res.status(200).json({ msg: "angry added" });
                      } else {
                        return res.status(200).json({ msg: "angry added" });
                      }
                    }
                  });
                }
              });
            } else {
              const ops = [Aerospike.lists.append("angry", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("l_c", 1)];
                  client.operate(post_key, ops, async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // return res.status(200).json({ msg: "Angry  added" });
                      if (meta.bins.angry.length === 0) {
                        const ops = [Aerospike.operations.incr("angry", 1)];
                        const data = await client.operate(post_key, ops);
                        // return res.status(200).json({ msg: "angry added" });
                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Angry post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            }
                          }
                        }
                      } else {
                        // return res.status(200).json({ msg: "angry added" });

                        if (post.bins.u_dun === req.user.handleUn) {
                          return res.status(200).json({ msg: "Liked post" });
                        } else {
                          if (req.user.flwr_c > 2) {
                            console.log("Popular");
                            if (post.bins.pop.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("pop", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            }
                          } else {
                            console.log("Normal");
                            if (post.bins.ran.length <= 2) {
                              const ops = [
                                Aerospike.lists.append("ran", {
                                  handleUn: req.user.handleUn,
                                  pic: req.user.p_i || "",
                                }),
                              ];
                              const data = await client.operate(post_key, ops);
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
                            } else {
                              return res
                                .status(200)
                                .json({ msg: "Angry post" });
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
        } else {
          const ops = [Aerospike.lists.append("angry", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [
                Aerospike.operations.incr("l_c", 1),
                Aerospike.operations.incr("angry", 1),
              ];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // return res.status(200).json({ msg: "angry added" });
                  if (meta.bins.angry.length === 0) {
                    const ops = [Aerospike.operations.incr("angry", 1)];
                    const data = await client.operate(post_key, ops);
                    // return res.status(200).json({ msg: "angry added" });

                    if (post.bins.u_dun === req.user.handleUn) {
                      return res.status(200).json({ msg: "Angry post" });
                    } else {
                      if (req.user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Angry post" });
                        } else {
                          return res.status(200).json({ msg: "Angry post" });
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Angry post" });
                        } else {
                          return res.status(200).json({ msg: "Angry post" });
                        }
                      }
                    }
                  } else {
                    // return res.status(200).json({ msg: "angry added" });
                    if (post.bins.u_dun === req.user.handleUn) {
                      return res.status(200).json({ msg: "Angry post" });
                    } else {
                      if (req.user.flwr_c > 2) {
                        console.log("Popular");
                        if (post.bins.pop.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("pop", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Angry post" });
                        } else {
                          return res.status(200).json({ msg: "Angry post" });
                        }
                      } else {
                        console.log("Normal");
                        if (post.bins.ran.length <= 2) {
                          const ops = [
                            Aerospike.lists.append("ran", {
                              handleUn: req.user.handleUn,
                              pic: req.user.p_i || "",
                            }),
                          ];
                          const data = await client.operate(post_key, ops);
                          return res.status(200).json({ msg: "Angry post" });
                        } else {
                          return res.status(200).json({ msg: "Angry post" });
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
    } catch (error) {
      next(error);
    }
  }

  /**
   * @FULLPOST_PAST_CODE
   * */
  async fetchBlockFeed(req, res, next) {
    // try {
    //   const client = await getAerospikeClient();
    //   let query = client.query(process.env.CLUSTER_NAME, process.env.SET_GROUP);
    //   const tempBin1 = "ExpVar";
    //   const stream = query.foreach();
    //   var arr = [];
    //   var temp = [];
    //   var result = [];
    //   var posts = [];
    //   stream.on("data", function (record) {
    //     if (record.bins.g_mem.includes(req.user.handleUn)) {
    //       arr.push({
    //         key: new Aerospike.Key(
    //           process.env.CLUSTER_NAME,
    //           process.env.SET_GROUP_META,
    //           record.bins.g_id
    //         ),
    //         readAllBins: true,
    //       });
    //     }
    //   });
    //   stream.on("end", function (record) {
    //     client.batchRead(arr, async (err, results) => {
    //       results.map((data) => {
    //         var posts = data.record.bins.posts;
    //         temp = [...temp, ...posts];
    //         for (let i = 0; i < temp.length; i++) {
    //           result.push({
    //             key: new Aerospike.Key(
    //               process.env.CLUSTER_NAME,
    //               process.env.SET_GROUP_POSTS,
    //               temp[i]
    //             ),
    //             readAllBins: true,
    //           });
    //         }
    //         client.batchRead(result, async (err, results) => {
    //           results.map((data) => {
    //             if (data.bins) {
    //               posts.push(data.bins);
    //             }
    //           });
    //         });
    //       });
    //       return res.status(200).json(posts);
    //     });
    //   });
    // } catch (error) {
    //   next(error);
    // }
  }

  async createPost(req, res, next) {
    try {
      console.log("New API Call ", req.body);
      if (!req.params.id) {
        return res.status(400).json({ msg: "Request params id" });
      } else {
        const data = await createBlockPost(
          req.file,
          req.params.id,
          req.body,
          req.user
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * @FULLPOST_PAST
   * */
  // async fetchSinglePost(req, res, next) {
  //   try {
  //     const client = await getAerospikeClient();
  //     if (!req.params.id) {
  //       return res.status(401).json({ msg: "Group id is not present" });
  //     } else {
  //       var post_key = new Aerospike.Key(

  //         process.env.CLUSTER_NAME,
  //         process.env.SET_GROUP_POSTS,
  //         req.params.id.toString()
  //       );
  //       var post_key_analytics = new Aerospike.Key(
  //         process.env.CLUSTER_NAME,
  //         "group_posts_meta",
  //         req.params.id.toString()
  //       );

  //       const postAnalyticsData = await client.get(post_key_analytics);
  //       const data = postAnalyticsData.bins;

  //       try {
  //         console.log("FROM HERE");
  //         return res.status(200).json(data);
  //       } catch (err) {
  //         return res.status(501).json({ msg: err.message });
  //       }
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * @FULLPOST_PAST
   * */

  // async fetchFullPost(req, res, next) {
  //   console.log("FULL");
  //   try {
  //     const client = await getAerospikeClient();
  //     if (!req.params.id) {
  //       return res.status(401).json({ msg: "Group id is not present" });
  //     } else {
  //       var post_key = new Aerospike.Key(
  //         process.env.CLUSTER_NAME,
  //         process.env.SET_GROUP_POSTS,
  //         req.params.id.toString()
  //       );

  //       const post = await client.get(post_key);
  //       const data = post.bins;

  //       try {
  //         return res.status(200).json(data);
  //       } catch (err) {
  //         return res.status(501).json({ msg: err.message });
  //       }
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * @BOOKMARK_PAST
   * */

  // async bookmarkPost(req, res, next) {
  //   try {
  //     const client = await getAerospikeClient();
  //     if (!req.params.id) {
  //       return res.status(400).json({ msg: "Inva;lid request" });
  //     } else {
  //       const post_key = new Aerospike.Key(
  //         process.env.CLUSTER_NAME,
  //         process.env.SET_MAIN_GROUP_POST,
  //         req.params.id
  //       );
  //       const post_feed_key = new Aerospike.Key(
  //         process.env.CLUSTER_NAME,
  //         process.env.SET_GROUP_POSTS,
  //         req.params.id
  //       );
  //       let query = client.query(
  //         process.env.CLUSTER_NAME,
  //         process.env.SET_MAIN_GROUP_POST
  //       );
  //       const tempBin = "ExpVar"; // this bin is to hold expression read operation output
  //       query.select(["book"]); //select single bin
  //       query.where(Aerospike.filter.equal("p_id", req.params.id));
  //       const stream = query.foreach();
  //       stream.on("data", async function (record) {
  //         console.log(record);
  //         var bookmarkArr = record.bins.book;
  //         if (bookmarkArr.includes(req.user.handleUn)) {
  //           // console.log("Bookmarked")
  //           const ops = [
  //             Aerospike.lists.removeByValue("book", req.user.handleUn),
  //           ];
  //           await client.operate(post_key, ops);
  //           try {
  //             await client.operate(post_feed_key, ops);
  //           } catch (error) {
  //             return res.status(400).json({ msg: error.message });
  //           }
  //         } else {
  //           // console.log("Not Bookmarked")
  //           const ops = [Aerospike.lists.append("book", req.user.handleUn)];
  //           await client.operate(post_key, ops);
  //           try {
  //             await client.operate(post_feed_key, ops);
  //           } catch (error) {
  //             return res.status(400).json({ msg: error.message });
  //           }
  //         }
  //       });
  //       stream.on("end", async function (posts) {
  //         var postData = await client.get(post_key);
  //         res.status(200).json(postData.bins);
  //       });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * @REPOST_PAST
   */
  // async repostPost(req, res, next) {
  //   try {
  //     const client = await getAerospikeClient();
  //     if (!req.params.id) {
  //       return res.status(400).json({ mg: "Invalid request" });
  //     } else {
  //       const post_key = new Aerospike.Key(
  //         process.env.CLUSTER_NAME,
  //         process.env.SET_MAIN_GROUP_POST,
  //         req.params.id
  //       );
  //       const data = await client.get(post_key);
  //       try {
  //         // console.log(data.bins);
  //         var post_id = now.micro();
  //         const re_post_key = new Aerospike.Key(
  //           process.env.CLUSTER_NAME,
  //           process.env.SET_MAIN_GROUP_POST,
  //           post_id
  //         );
  //         const post_meta_key = new Aerospike.Key(
  //           process.env.CLUSTER_NAME,
  //           process.env.SET_GROUP_POST_META,
  //           post_id.toString()
  //         );
  //         const post_comment = new Aerospike.Key(
  //           process.env.CLUSTER_NAME,
  //           process.env.SET_GROUP_POST_COMMENT,
  //           post_id.toString()
  //         );
  //         const original = data.bins;
  //         const post_bins = {
  //           p_id: post_id.toString(),
  //           likes: 0,
  //           book: [],
  //           pinned: false,
  //           content: original.content,
  //           u_id: original.u_id.toString(),
  //           u_fn: original.u_fn,
  //           u_ln: original.u_ln,
  //           u_dun: original.u_dun,
  //           u_img: original.u_img,
  //           hide: [],
  //           spam: 0,
  //           c_t: new Date().getTime().toString(),
  //           u_t: new Date().getTime().toString(),
  //           comments: [],
  //           url: "",
  //           group_id: original.group_id.toString(),
  //           shares: 0,
  //           tran_cnt: 0,
  //           isReposted: true,
  //           deleted: false,
  //           is_share: true,
  //           share_d: {
  //             u_id: req.user.u_id.toString(),
  //             u_fn: req.user.fn,
  //             u_ln: req.user.ln,
  //             u_dun: req.user.handleUn,
  //             u_img: req.user.p_i,
  //             r_content: req.body.repostContent || "",
  //           },
  //         };
  //         const post_meta_bins = {
  //           p_id: post_id.toString(),
  //           likes: [],
  //           heart: [],
  //           haha: [],
  //           party: [],
  //           dislikes: [],
  //           spam: [],
  //           share: [],
  //         };
  //         const post_comment_bins = {
  //           pid: post_id,
  //         };
  //         await client.put(post_meta_key, post_meta_bins);
  //         await client.put(re_post_key, post_bins);
  //         await client.put(post_comment, post_comment_bins);
  //         const ops = [Aerospike.operations.incr("shares", 1)];
  //         await client.operate(post_key, ops);

  //         const post_data = await client.get(re_post_key);
  //         return res
  //           .status(200)
  //           .json({ msg: "Post shared", post: post_data.bins });
  //       } catch (err) {
  //         return res.status(400).json({ msg: err.message });
  //       }
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async hideUnhidePost(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Inva;lid request" });
      } else {
        const post_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_MAIN_GROUP_POST,
          req.params.id
        );
        const post_feed_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP_POSTS,
          req.params.id
        );

        const ops = [Aerospike.lists.append("hide", req.user.handleUn)];
        const data = await client.operate(post_key, ops);
        try {
          const data = await client.operate(post_feed_key, ops);
          try {
            return res.status(200).json(data);
          } catch (error) {
            return res.status(400).json({ msg: error.message });
          }
        } catch (error) {
          return res.status(400).json({ msg: error.message });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchAnalytics(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        console.log(req.params.id);
        const post_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP_POSTS,
          req.params.id
        );
        const post_meta_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_GROUP_POST_META,
          req.params.id
        );

        var post;

        client.exists(post_key, async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            if (!result) {
              return res.status(400).json({ msg: "Invalid request" });
            } else {
              const mapOps = [
                Aerospike.maps
                  .getByKey("analytics", req.query.date)
                  .andReturn(maps.returnType.KEY_VALUE),
              ];
              client.operate(post_meta_key, mapOps, async (err, result) => {
                const post = await client.get(post_meta_key);
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ metaData: post, analytics: result.bins.analytics });
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

  //**************** GROUP POST COMMENT **************//
  async createComment(req, res, next) {
    try {
      const id = req.params.id;
      const data = await createBlockPostComment(
        id,
        req.file,
        req.body,
        req.user
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchComments(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid" });
      } else {
        // const client = await getAerospikeClient();
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USER_META,
        //   req.user.handleUn
        // );
        // const user_meta = await client.get(key);
        // var arr = [];
        // var sortedBy = req.query.sortedBy;

        // var query = client.query(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP_POST_COMMENT
        // );
        // query.where(Aerospike.filter.equal("postID", req.params.id));
        // var stream = query.foreach();

        // stream.on("data", function (record) {
        //   // arr.push(data.bins);
        //   if (req.user.handleUn !== record.bins.c_handleUn) {
        //     arr.push(record.bins);
        //   }
        // });

        // stream.on("end", function (posts) {
        //   if (sortedBy === "old") {
        //     var temp = arr.sort((a, b) => a.c_id - b.c_id);
        //     const page = req.query.page;
        //     const limit = req.query.limit;
        //     const sortedBy = req.query.sortedBy;
        //     var start = (page - 1) * limit;
        //     var end = page * limit;
        //     var data = temp.slice(start, end);
        //     return res.status(200).json(data);
        //   } else if (sortedBy === "pop ") {
        //     var temp = arr.sort((a, b) => b.l_c - a.l_c);
        //     const page = req.query.page;
        //     const limit = req.query.limit;
        //     const sortedBy = req.query.sortedBy;
        //     var start = (page - 1) * limit;
        //     var end = page * limit;
        //     var data = temp.slice(start, end);
        //     return res.status(200).json(data);
        //   } else {
        //     var temp = arr.sort((a, b) => b.c_id - a.c_id);
        //     const page = req.query.page;
        //     const limit = req.query.limit;
        //     const sortedBy = req.query.sortedBy;
        //     var start = (page - 1) * limit;
        //     var end = page * limit;
        //     var data = temp.slice(start, end);
        //     return res.status(200).json(data);
        //   }
        // });
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        const data = await fetchAllBlockComments(
          req.params.id,
          req.user.handleUn,
          sortedBy,
          page,
          limit
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchMyComments(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid" });
      } else {
        // const client = await getAerospikeClient();
        // const key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USER_META,
        //   req.user.handleUn
        // );
        // const user_meta = await client.get(key);
        // var arr = [];
        // var sortedBy = req.query.sortedBy;

        // var query = client.query(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_GROUP_POST_COMMENT
        // );
        // query.where(Aerospike.filter.equal("postID", req.params.id));
        // var stream = query.foreach();

        // stream.on("data", function (record) {
        //   // arr.push(data.bins);
        //   if (req.user.handleUn === record.bins.c_handleUn) {
        //     arr.push(record.bins);
        //   }
        // });

        // stream.on("end", function (posts) {
        //   // console.log(sortedBy);
        //   arr = arr.sort((a, b) => b.c_id - a.c_id);
        //   var page = req.query.page || 1;
        //   var limit = req.query.limit || 1;
        //   var start = (page - 1) * limit;
        //   var end = page * limit;
        //   var count = 0;
        //   arr = arr.slice(start, end);
        //   console.log(arr);
        //   return res.status(200).json(arr);
        // });
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        const data = await fetchMyBlockComments(
          req.params.id,
          req.user.handleUn,
          sortedBy,
          page,
          limit
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async likeComment(req, res, next) {
    if (!req.params.id || !req.params.username || !req.params.type) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      console.log(req.params.type);
      // var batchRecords = [];
      // const batchType = Aerospike.batchType;
      // const client = await getAerospikeClient();
      // const post_comment_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT,
      //   req.params.id
      // );

      // const post_comment_meta_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT_META,
      //   req.params.id
      // );

      // let batchPolicy1 = new Aerospike.BatchPolicy({});
      // var batchArrKeys = [post_comment_key, post_comment_meta_key];

      // const commentData = await client.get(post_comment_key);
      // const commentMetaData = await client.get(post_comment_meta_key);

      // var commentOps;
      // var commentMetaOps;

      // if (req.params.type === "like") {
      //   console.log("## LIKE ##");
      //   if (commentData.bins.l_c > 0) {
      //     if (commentMetaData.bins.likes.includes(req.user.handleUn)) {
      //       commentOps = [Aerospike.operations.incr("l_c", -1)];
      //       commentMetaOps = [
      //         Aerospike.lists.removeByValue("likes", req.user.handleUn),
      //       ];
      //     } else {
      //       commentOps = [Aerospike.operations.incr("l_c", 1)];
      //       commentMetaOps = [
      //         Aerospike.lists.append("likes", req.user.handleUn),
      //       ];
      //     }
      //   } else {
      //     commentOps = [Aerospike.operations.incr("l_c", 1)];
      //     commentMetaOps = [Aerospike.lists.append("likes", req.user.handleUn)];
      //   }
      // } else if (req.params.type === "dislike") {
      //   if (commentData.bins.l_c > 0) {
      //     if (commentMetaData.bins.dislikes.includes(req.user.handleUn)) {
      //       commentOps = [Aerospike.operations.incr("l_c", -1)];
      //       commentMetaOps = [
      //         Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
      //       ];
      //     } else {
      //       commentOps = [Aerospike.operations.incr("l_c", 1)];
      //       commentMetaOps = [
      //         Aerospike.lists.append("dislikes", req.user.handleUn),
      //       ];
      //     }
      //   } else {
      //     commentOps = [Aerospike.operations.incr("l_c", 1)];
      //     commentMetaOps = [
      //       Aerospike.lists.append("dislikes", req.user.handleUn),
      //     ];
      //   }
      // } else if (req.params.type === "haha") {
      //   console.log("## HAHA ##");
      //   if (Number(req.params.likeCount) > 0) {
      //     if (commentMetaData.bins.haha.includes(req.user.handleUn)) {
      //       commentOps = [Aerospike.operations.incr("l_c", -1)];
      //       commentMetaOps = [
      //         Aerospike.lists.removeByValue("haha", req.user.handleUn),
      //       ];
      //     } else {
      //       commentOps = [Aerospike.operations.incr("l_c", 1)];
      //       commentMetaOps = [
      //         Aerospike.lists.append("haha", req.user.handleUn),
      //       ];
      //     }
      //   } else {
      //     commentOps = [Aerospike.operations.incr("l_c", 1)];
      //     commentMetaOps = [Aerospike.lists.append("haha", req.user.handleUn)];
      //   }
      // } else if (req.params.type === "angry") {
      //   if (Number(req.params.likeCount) > 0) {
      //     if (commentMetaData.bins.haha.includes(req.user.handleUn)) {
      //       commentOps = [Aerospike.operations.incr("l_c", -1)];
      //       commentMetaOps = [
      //         Aerospike.lists.removeByValue("angry", req.user.handleUn),
      //       ];
      //     } else {
      //       commentOps = [Aerospike.operations.incr("l_c", 1)];
      //       commentMetaOps = [
      //         Aerospike.lists.append("angry", req.user.handleUn),
      //       ];
      //     }
      //   } else {
      //     commentOps = [Aerospike.operations.incr("l_c", 1)];
      //     commentMetaOps = [Aerospike.lists.append("angry", req.user.handleUn)];
      //   }
      // }

      // for (let i = 0; i < batchArrKeys.length; i++) {
      //   if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
      //     batchRecords.push({
      //       type: batchType.BATCH_WRITE,
      //       key: batchArrKeys[i],
      //       ops: commentOps,
      //     });
      //   } else {
      //     batchRecords.push({
      //       type: batchType.BATCH_WRITE,
      //       key: batchArrKeys[i],
      //       ops: commentMetaOps,
      //     });
      //   }
      // }

      // await client.batchWrite(batchRecords, batchPolicy1);
      // try {
      //   console.log("Complete HERE ***");
      //   // return res.status(200).json({ msg: "Complete" });
      //   if (req.params.username !== req.user.handleUn) {
      //     const map_key = new Aerospike.Key(
      //       process.env.CLUSTER_NAME,
      //       process.env.SET_APP_HISTORY,
      //       req.params.username
      //     );
      //     const notificationData = {
      //       id: commentData.bins.postId,
      //       ty: 8,
      //       vi: false,
      //       wo: req.user.handleUn,
      //       ti: Date.now(),
      //       nm: `${req.user.fn} ${req.user.ln}`,
      //       pi: req.user.p_i,
      //       cat: 4,
      //       re: req.params.username,
      //     };
      //     const map_ops = [
      //       Aerospike.operations.write("n_id", req.params.username),
      //       Aerospike.maps.put("notification", Date.now(), notificationData, {
      //         order: maps.order.KEY_ORDERED,
      //       }),
      //       Aerospike.operations.incr("count", 1),
      //     ];
      //     let result = await client.operate(map_key, map_ops);
      //     return res.status(200).json({
      //       msg: `You reacted ${req.params.type} on this comment`,
      //       notificationData,
      //     });
      //   } else {
      //     return res
      //       .status(200)
      //       .json({ msg: `You reacted ${req.params.type} on this comment` });
      //   }
      // } catch (error) {
      //   return res.status(400).json({ msg: "Something went wrong" });
      // }
      const data = await blockLikeComment(
        req.params.id,
        req.params.type,
        req.params.likeCount,
        req.params.username,
        req.user
      );
      return res.status(200).json(data);
    }
  }

  async removeLike(req, res, next) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid parameter" });
    } else {
      // var batchRecords = [];
      // const batchType = Aerospike.batchType;
      // const client = await getAerospikeClient();
      // const post_comment_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT,
      //   req.params.id
      // );
      // const post_comment_meta_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT_META,
      //   req.params.id
      // );
      // let batchPolicy1 = new Aerospike.BatchPolicy({});
      // var batchArrKeys = [post_comment_key, post_comment_meta_key];
      // for (let i = 0; i < batchArrKeys.length; i++) {
      //   if (batchArrKeys[i].set === process.env.SET_GROUP_POST_COMMENT) {
      //     batchRecords.push({
      //       type: batchType.BATCH_WRITE,
      //       key: batchArrKeys[i],
      //       ops: [Aerospike.operations.incr("l_c", -1)],
      //     });
      //   } else {
      //     batchRecords.push({
      //       type: batchType.BATCH_WRITE,
      //       key: batchArrKeys[i],
      //       ops: [
      //         Aerospike.lists.removeByValue("likes", req.user.handleUn),
      //         Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
      //         Aerospike.lists.removeByValue("haha", req.user.handleUn),
      //         Aerospike.lists.removeByValue("angry", req.user.handleUn),
      //       ],
      //     });
      //   }
      // }
      // await client.batchWrite(batchRecords, batchPolicy1);
      // try {
      //   return res.status(200).json({ msg: "Emoji reaction remove" });
      // } catch (error) {
      //   return res.status(400).json({ msg: error.message });
      // }

      const data = await blockRemoveLikeComment(
        req.params.id,
        req.user.handleUn
      );
      return res.status(200).json(data);
    }
  }

  /**
   *
   * @REPORT_PAST
   */
  // async reportComment(req, res, next) {
  //   const commentId = req.params.id;
  //   const client = await getAerospikeClient();
  //   if (!commentId) {
  //     return res.status(401).json({ msg: "Invalid request" });
  //   } else {
  //     const comment_meta_key = new Aerospike.Key(
  //       process.env.CLUSTER_NAME,
  //       process.env.SET_GROUP_POST_COMMENT_META,
  //       req.params.id
  //     );
  //     const comment_key = new Aerospike.Key(
  //       process.env.CLUSTER_NAME,
  //       process.env.SET_GROUP_POST_COMMENT,
  //       req.params.id
  //     );

  //     const data = await client.get(comment_meta_key);
  //     const metaData = data.bins;

  //     if (metaData.spam.includes(req.user.handleUn)) {
  //       const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
  //       client.operate(comment_meta_key, ops, (err, result) => {
  //         if (err) {
  //           return res.status(400).json({ msg: err.message });
  //         } else {
  //           const ops1 = [Aerospike.operations.incr("s_c", -1)];
  //           client.operate(comment_key, ops1, (err, result) => {
  //             if (err) {
  //               return res.status(400).json({ msg: err.message });
  //             } else {
  //               return res.status(200).json({ msg: "spam removed" });
  //             }
  //           });
  //         }
  //       });
  //     } else {
  //       const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
  //       client.operate(comment_meta_key, ops, (err, result) => {
  //         if (err) {
  //           return res.status(400).json({ msg: err.message });
  //         } else {
  //           const ops1 = [Aerospike.operations.incr("s_c", 1)];
  //           client.operate(comment_key, ops1, (err, result) => {
  //             if (err) {
  //               return res.status(400).json({ msg: err.message });
  //             } else {
  //               return res.status(200).json({ msg: "spam added" });
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
  // }

  /**
   * @PAST_CODE
   */
  // async pinnedComment(req, res, next) {
  //   const postId = req.body.postId;
  //   const commentId = req.params.id;
  //   const client = await getAerospikeClient();
  //   if (!postId || !commentId) {
  //     return res.status(401).json({ msg: "Invalid request" });
  //   } else {
  //     const post_key = new Aerospike.Key(
  //       process.env.CLUSTER_NAME,
  //       process.env.SET_GROUP_POST_COMMENT,
  //       postId
  //     );
  //     const postData = await client.get(post_key);
  //     // console.log(postData.bins);
  //     const comment_pinned_ops = [
  //       Aerospike.maps
  //         .getByKey("comments", commentId.toString())
  //         .andReturn(maps.returnType.VALUE),
  //     ];

  //     client.operate(post_key, comment_pinned_ops, (err, result) => {
  //       if (err) {
  //         return res.status(401).json({ msg: err.message });
  //       } else {
  //         // console.log(result.bins)
  //         if (!result.bins.comments.pinned) {
  //           console.log("Pinned set to false");
  //           result.bins.comments.pinned = true;
  //           const post_comment_ops = [
  //             Aerospike.maps.put("comments", commentId, result.bins.comments),
  //           ];

  //           client.operate(post_key, post_comment_ops, async (err, result) => {
  //             if (err) {
  //               return res.status(401).json({ msg: err.message });
  //             } else {
  //               const postData = await client.get(post_key);
  //               // console.log(postData.bins);
  //               return res.status(200).json({
  //                 msg: "You pinned this comment",
  //                 post: postData.bins,
  //               });
  //             }
  //           });
  //         } else {
  //           console.log("Pinned set to true");
  //           result.bins.comments.pinned = false;
  //           const post_comment_ops = [
  //             Aerospike.maps.put("comments", commentId, result.bins.comments),
  //           ];

  //           client.operate(post_key, post_comment_ops, async (err, result) => {
  //             if (err) {
  //               return res.status(401).json({ msg: err.message });
  //             } else {
  //               const postData = await client.get(post_key);
  //               // console.log(postData.bins);
  //               return res.status(200).json({
  //                 msg: "You unpinned this comment",
  //                 post: postData.bins,
  //               });
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }
  // }

  async editComment(req, res, next) {
    try {
      const commentId = req.params.id;
      // const client = await getAerospikeClient();
      // const key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT,
      //   commentId
      // );

      // client.exists(key, async (err, data) => {
      //   if (err) {
      //     return res.status(400).json({ msg: err.message });
      //   } else {
      //     if (!data) {
      //       return res.status(400).json({ msg: "No comment found" });
      //     } else {
      //       const ops = [
      //         Aerospike.operations.write("comment", req.body.message),
      //       ];
      //       const data = await client.operate(key, ops);
      //       try {
      //         return res.status(400).json({ msg: "Comment updated" });
      //       } catch (err) {
      //         return res.status(400).json({ msg: err.message });
      //       }
      //     }
      //   }
      // });
      const data = await editBlockComment(commentId, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const commentId = req.params.id;
      // const client = await getAerospikeClient();
      // const key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_GROUP_POST_COMMENT,
      //   commentId
      // );

      // client.exists(key, async (err, data) => {
      //   if (err) {
      //     return res.status(400).json({ msg: err.message });
      //   } else {
      //     if (!data) {
      //       return res.status(400).json({ msg: "No comment found" });
      //     } else {
      //       const data = await client.get(key);
      //       const postId = data.bins.postID;
      //       const post_key = new Aerospike.Key(
      //         process.env.CLUSTER_NAME,
      //         process.env.SET_MAIN_GROUP_POST,
      //         postId
      //       );
      //       const post_ops = [Aerospike.operations.incr("c_c", -1)];
      //       const ops = [Aerospike.operations.write("delete", true)];
      //       client.operate(key, ops, (err, result) => {
      //         if (err) {
      //           return res.status(400).json({ msg: err.message });
      //         } else {
      //           client.operate(post_key, post_ops, (err, result) => {
      //             if (err) {
      //               return res.status(400).json({ msg: err.message });
      //             } else {
      //               return res
      //                 .status(200)
      //                 .json({ msg: "Comment has been deleted" });
      //             }
      //           });
      //         }
      //       });
      //     }
      //   }
      // });
      const data = await blockDeleteComment(commentId);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async hideComment(req, res, next) {
    try {
      const commentId = req.params.id;
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_GROUP_POST_COMMENT,
        commentId
      );

      client.exists(key, async (err, data) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!data) {
            return res.status(400).json({ msg: "No comment found" });
          } else {
            const data = await client.get(key);
            if (data.bins.hide.includes(req.user.handleUn)) {
              console.log("Already hide");
              const ops = [
                Aerospike.lists.removeByValue("hide", req.user.handleUn),
              ];
              client.operate(key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: "err.message" });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You unhide this comment" });
                }
              });
            } else {
              const ops = [Aerospike.lists.append("hide", req.user.handleUn)];
              client.operate(key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: "err.message" });
                } else {
                  return res.status(200).json({ msg: "You hide this comment" });
                }
              });
            }
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // ******************* Replies ******************* //
  async createReply(req, res) {
    // const client = await getAerospikeClient();
    // const commentId = req.params.id;
    // const reply_id = now.micro();
    // const reply_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   SET_BLOCK_COMMENT_REPLY,
    //   reply_id
    // );
    // const post_comment_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_GROUP_POST_COMMENT,
    //   commentId
    // );

    // const reply_bins = {
    //   id: reply_id,
    //   content: req.body.replyText,
    //   like: [], // Like counter
    //   d: [], // Dislike counter
    //   s: [], // Spam counter
    //   c_t: new Date().getTime().toString(),
    //   u_t: new Date().getTime().toString(),
    //   timestamp: Date.now(),
    //   hides: [], // Hides
    //   delete: false,
    //   c_u_fn: req.user.firstName,
    //   c_u_ln: req.user.lastName,
    //   c_u_du: req.user.handleUn,
    //   c_u_img: req.user.p_i,
    //   cmnt_id: req.body.cmnt_id,
    // };
    // const post_comment_ops = [
    //   Aerospike.maps.put("replies", reply_id, reply_bins),
    // ];

    // client.operate(reply_key, post_comment_ops, (err, result) => {
    //   if (err) {
    //     return res.status(400).json({ msg: err.message });
    //   } else {
    //     console.log("Reply saved");
    //     const get_post_comment_ops = [
    //       Aerospike.maps
    //         .getByKey("replies", reply_id)
    //         .andReturn(maps.returnType.VALUE),
    //     ];

    //     const ops = [
    //       Aerospike.maps
    //         .getByKey("comments", commentId)
    //         .andReturn(maps.returnType.VALUE),
    //     ];
    //     client.operate(post_comment_key, ops, (err, result) => {
    //       if (err) {
    //         return res.status(400).json({ msg: err.message });
    //       } else {
    //         result.bins.comments.r_c = result.bins.comments.r_c + 1;
    //         const cmnt_ops = [
    //           Aerospike.maps.put("comments", commentId, result.bins.comments),
    //         ];
    //         client.operate(post_comment_key, cmnt_ops, (err, result) => {
    //           if (err) {
    //             return res.status(400).json({ msg: err.message });
    //           } else {
    //             client.operate(
    //               reply_key,
    //               get_post_comment_ops,
    //               (err, result) => {
    //                 if (err) {
    //                   return res.status(400).json({ msg: err.message });
    //                 } else {
    //                   return res.status(200).json(result.bins);
    //                 }
    //               }
    //             );
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
    const data = await createBlockReply(req.params.id, req.body, req.user);
    return res.status(200).json(data);
  }

  async fetchReplies(req, res, next) {
    try {
      // // commentId == req.params.id
      // if (!req.params.id) {
      //   return res.status(400).json({ msg: "Invalid request" });
      // } else {
      //   const reply_key = new Aerospike.Key(
      //     process.env.CLUSTER_NAME,
      //     "comment_reply",
      //     req.params.id
      //   );
      //   const replyData = await client.get(reply_key);
      //   var page = req.query.page;
      //   var limit = 3;
      //   var start = (page - 1) * limit;
      //   var end = page * limit;
      //   var arr = [];
      //   var commentData = [];
      //   for (i in replyData.bins.replies) {
      //     arr.push(replyData.bins.replies[i]);
      //   }
      //   if (page <= limit) {
      //     commentData = arr.slice(start, end);
      //   }
      //   return res.status(200).json(commentData);
      // }
      const page = req.query.page || 1;
      const limit = req.query.limit || 3;
      const data = await getReplyes(req.params.id, page, limit);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async hideCommentReply(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const replyId = req.params.id;
      const commentId = req.body.commentId;
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        "comment_reply",
        commentId
      );
      const comment_hide_ops = [
        Aerospike.maps
          .getByKey("replies", replyId)
          .andReturn(maps.returnType.VALUE),
      ];

      client.operate(post_key, comment_hide_ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!result.bins.replies.hides.includes(req.user.handleUn)) {
            result.bins.replies.hides.push(req.user.handleUn);

            const reply_hide_ops = [
              Aerospike.maps.put("replies", replyId, result.bins.replies),
            ];

            client.operate(post_key, reply_hide_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "you hide this reply" });
              }
            });
          } else {
            const index = result.bins.replies.hides.indexOf(
              req.user._id.toString()
            );
            result.bins.replies.hides.splice(index, 1);
            const reply_hide_ops = [
              Aerospike.maps.put("replies", replyId, result.bins.replies),
            ];
            client.operate(post_key, reply_hide_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "you unhide this reply" });
              }
            });
          }
        }
      });
    }
  }

  async deleteReply(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await deleteBlockReply(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async editReply(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await editBlockReply(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async likeReply(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const data = await likeBlockReply(req.params.id, req.user.handleUn);
      return res.status(200).json(data);
    }
  }

  async dislikeReply(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await dislikeBlockReply(req.params.id, req.user.handleUn);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async spamReply(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await spamBlockReply(req.params.id, req.user.handleUn);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // ******************* Events ******************* //
  async createEvent(req, res, next) {
    console.log("Event create");
    try {
      const data = await createBlockEvent(req.file, req.body, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async fetchEvents(req, res, next) {
    console.log("Call Events");
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid block id" });
      } else {
        // let query = client.query(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_BLOCK_EVENT
        // );
        // const tempBin = "ExpVar";
        // query.where(Aerospike.filter.equal("b_id", req.params.id));

        // // const queryPolicy = new Aerospike.QueryPolicy({});
        // const stream = query.foreach();
        // var temp = [];
        // stream.on("data", async function (record) {
        //   temp.push(record.bins);
        // });
        // stream.on("end", async function (record) {
        //   var page = req.query.page || 1;
        //   var limit = req.query.limit || 3;
        //   var start = (page - 1) * limit;
        //   var end = page * limit;
        //   var count = 0;

        //   temp = temp.splice(start, end);
        //   return res.status(200).json(temp);
        // });
        var page = req.query.page || 1;
        var limit = req.query.limit || 3;
        const data = await fetchAllEvents(req.params.id, page, limit);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async joinEvent(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        console.log(req.params.id, req.user.handleUn);
        const data = await blockEventJoin(req.params.id, req.user.handleUn);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchEvent(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await fetchSingleEvent(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      if (!req.params.id) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        const data = await blockEventDelete(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async eventInterest(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid request paramster");
      } else {
        const array = JSON.parse(req.body.list);
        const data = await addEventInterest(
          req.params.id,
          req.user,
          req.query.value,
          array
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async eventNotInterest(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid request paramster");
      } else {
        const array = JSON.parse(req.body.list);
        const data = await addEventNotInterest(
          req.params.id,
          req.user,
          req.query.value,
          array
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async eventjoin(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Invalid request paramster");
      } else {
        const array = JSON.parse(req.body.list);
        const data = await addEventJoin(
          req.params.id,
          req.user,
          req.query.value,
          array
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const event_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_EVENT,
        req.params.id
      );

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_BLOCK_EVENT
      );
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      // query.select(["tit", "des", "s_d", "e_d", "s_t", "e_t", "price"]); //select single bin
      query.where(Aerospike.filter.equal("e_id", req.params.id));

      // const queryPolicy = new Aerospike.QueryPolicy({});
      const stream = query.foreach();
      stream.on("data", async function (record) {
        var data = record.bins;
        // console.log(data)
        if (
          !req.body.title.trim() ||
          !req.body.description.trim() ||
          !req.body.startdate.trim() ||
          !req.body.enddate.trim() ||
          !req.body.starttime.trim() ||
          !req.body.endtime.trim()
        ) {
          return res.status(400).json({ msg: "Invalid request" });
        } else {
          console.log("Body");
          console.log(req.body);

          console.log("END");

          const ops = [
            Aerospike.operations.write("tit", req.body.title),
            Aerospike.operations.write("des", req.body.description),
            Aerospike.operations.write("s_d", req.body.startdate),
            Aerospike.operations.write("e_d", req.body.enddate),
            Aerospike.operations.write("s_t", req.body.starttime),
            Aerospike.operations.write("e_t", req.body.endtime),
            Aerospike.operations.write("price", req.body.price),
          ];
          await client.operate(event_key, ops);
        }
      });

      stream.on("end", async function (record) {
        const data = await client.get(event_key);
        console.log(data.bins);
        return res.status(200).json({ msg: "Event has been updated" });
      });
    }
  }
}
module.exports = new BlockPostController();

// eventData.j_u
