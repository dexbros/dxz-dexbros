/** @format */
const jwt = require("jsonwebtoken");
const { Storage } = require("@google-cloud/storage");
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const maps = Aerospike.maps;
const { getAerospikeClient } = require("../aerospike");
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");
const batchType = Aerospike.batchType;
var createError = require("http-errors");
const { uploadImage } = require("../helper/uploadImage");

class PostModel {
  constructor() {}

  async updatePostViewCount(data) {
    var temp = [];
    const client = await getAerospikeClient();
    let batchPolicy = new Aerospike.BatchPolicy({});
    const arr = JSON.parse(data.posts);
    console.log(data);
    // console.log("Array data: ", arr.length);
    // for (let i = 0; i <= arr.length; i++) {
    //   if (arr[i]) {
    //     console.log("Arrar: ", arr[i]);
    //     const key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_POSTS,
    //       arr[i]
    //     );
    //     temp.push(key);
    //   }
    // }

    // let batchRecords = [];
    // for (let i = 0; i < temp.length; i++) {
    //   batchRecords.push({
    //     type: batchType.BATCH_WRITE,
    //     key: temp[i],
    //     ops: [Aerospike.operations.incr("v_c", 1)],
    //   });
    // }

    // client.batchWrite(batchRecords, batchPolicy);
    // try {
    //   return "Successfully updated";
    // } catch (error) {
    //   return error.message;
    // }
  }

  // Pinned or Unpinned post
  async socialPinnedPost(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS,
        id
      );
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      query.select(["pinned"]); //select single bin
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();

      stream.on("data", async function (record) {
        if (record.bins.pinned > 0) {
          const ops = [Aerospike.operations.incr("pinned", -1)];
          await client.operate(post_key, ops);
          try {
          } catch (error) {
            throw createError.Conflict(error.message);
          }
        } else {
          const ops = [Aerospike.operations.incr("pinned", 1)];
          const data = await client.operate(post_key, ops);
          try {
          } catch (error) {
            throw createError.Conflict(error.message);
          }
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        // Perform any final processing here
        var postData = await client.get(post_key);
        resolve(postData);
      });
    });
  }

  // Bookmark social post
  async socialBookmark(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS,
        id
      );
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      query.select(["book"]); //select single bin
      query.where(Aerospike.filter.equal("id", id));

      // const queryPolicy = new Aerospike.QueryPolicy({});
      const stream = query.foreach();

      stream.on("data", async function (record) {
        var bookmarkArr = record.bins.book;
        if (bookmarkArr.includes(handleUn)) {
          console.log("Bookmarked");
          const ops = [Aerospike.lists.removeByValue("book", handleUn)];
          await client.operate(post_key, ops);
        } else {
          console.log("Not Bookmarked");
          const ops = [Aerospike.lists.append("book", handleUn)];
          await client.operate(post_key, ops);
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        // Perform any final processing here
        var postData = await client.get(post_key);
        resolve(postData);
      });
    });
  }

  async socialHidePost(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();

      var arr;
      const post_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS_META,
        id
      );
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS,
        id
      );
      var analytics_key = `${new Date().getDate()}-${
        new Date().getMonth() + 1
      }-${new Date().getFullYear()}`;

      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      query.select(["hide"]); //select single bin
      query.where(Aerospike.filter.equal("id", id));

      // const queryPolicy = new Aerospike.QueryPolicy({});
      const stream = query.foreach();
      stream.on("data", function (record) {
        arr = record.bins.hide;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        if (arr.includes(handleUn)) {
          const ops = [Aerospike.lists.removeByValue("hide", handleUn)];
          client
            .operate(post_key, ops)
            .then(async (data) => {
              resolve(data);
            })
            .catch((err) => {
              // return res.status(401).json({ msg: err.message });
              throw createError.BadRequest(err.message);
            });
        } else {
          const ops = [Aerospike.lists.append("hide", handleUn)];
          client
            .operate(post_key, ops)
            .then(async (data) => {
              // return res.status(200).json(data);
              resolve(data);
            })
            .catch((err) => {
              // return res.status(401).json({ msg: err.message });
              throw createError.BadRequest(err.message);
            });
        }
      });
    });
  }

  async socialPostEdit(data, id) {
    const client = await getAerospikeClient();
    const mainPostKey = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_POSTS,
      id
    );
    const postKey = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );

    const ops = [Aerospike.operations.write("content", data.editText)];
    client.operate(mainPostKey, ops, (err, result) => {
      if (err) {
        throw createError.BadRequest(err.message);
      } else {
        client.operate(postKey, ops, (err, result) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            // return res.status(200).json({ msg: "Edit updated post" });
            return { msg: "Edit updated post" };
          }
        });
      }
    });
  }

  async socialPostSpam(id, handleUn) {
    const client = await getAerospikeClient();
    var incrmentedBy = 0;

    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const postMetaData = await client.get(post_meta_key);
    console.log(postMetaData.bins);
    if (postMetaData.bins.spam.includes(handleUn)) {
      console.log("Already");
      const ops = [Aerospike.lists.removeByValue("spam", handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const ops = [Aerospike.operations.incr("sp_c", -1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              const data = await client.get(post_key);
              if (data.bins.sp_c >= process.env.MINIMUM_SPAM_COUNT) {
                const ops = [Aerospike.operations.write("isDisable", true)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    throw createError.BadRequest(err.message);
                  } else {
                    return { msg: "You remove spammed from this post" };
                  }
                });
              } else {
                const ops = [Aerospike.operations.write("isDisable", false)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    throw createError.BadRequest(err.message);
                  } else {
                    return { msg: "You remove spammed from this post" };
                  }
                });
              }
            }
          });
        }
      });
    } else {
      console.log("not");
      const ops = [Aerospike.lists.append("spam", handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const ops = [Aerospike.operations.incr("sp_c", 1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              throw createError.BadRequest(err.message);
            } else {
              const data = await client.get(post_key);
              if (data.bins.sp_c >= process.env.MINIMUM_SPAM_COUNT) {
                const ops = [Aerospike.operations.write("isDisable", true)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return { msg: "You spammed this post" };
                  }
                });
              } else {
                const ops = [Aerospike.operations.write("isDisable", false)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    throw createError.BadRequest(err.message);
                  } else {
                    return { msg: "You spammed this post" };
                  }
                });
              }
            }
          });
        }
      });
    }
  }

  async socialNewsFetch() {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var arr = [];
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_NEWS);
      const tempBin1 = "ExpVar";
      // query.where(Aerospike.filter.equal("handleUn", userhandleUn));
      const stream = query.foreach();
      stream.on("data", function (record) {
        arr.push(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        // return res.status(200).json(arr);
        resolve(arr);
      });
    });
  }

  async socialfetchUserRelatedPosts(handleUn, query) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
      var stream = query.foreach();
      var arr = [];

      stream.on("data", function (data) {
        arr.push(data.bins);
        // console.log(data.bins)
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        arr = arr.sort((a, b) => b.l_c - a.l_c);
        var page = query.page || 1;
        var limit = query.limit || 5;
        var start = (page - 1) * limit;
        var end = page * limit;
        var count = 0;
        arr = arr.slice(start, end);
        console.log("Array: ", arr);
        resolve(arr);
      });
    });
  }

  async userProfilePosts(handleUn, value) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
      query.where(Aerospike.filter.equal("u_dun", handleUn));
      const queryPolicy = new Aerospike.QueryPolicy();
      var stream = query.foreach();
      var arr = [];
      var page = value.page;
      var newLimit = 5;
      const limit = page > 0 ? 6 * page : 6 * 1;
      // console.log("limit : "+limit)
      var start = limit - 1;
      var itemStart = (Number(page) - 1) * newLimit;
      var itemEnd = Number(page) * newLimit;

      stream.on("data", async (data) => {
        arr.push(data.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        console.log(page);
        if (page <= limit) {
          var temp = arr.sort((a, b) => b.id - a.id);
          var postsData = temp.slice(itemStart, itemEnd);
        }
        resolve(postsData);
      });
    });
  }

  async socialTreandingWords() {
    return new Promise(async (resolve, reject) => {
      var arr = [];
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_TRENDING
      );
      const stream = query.foreach();

      stream.on("data", function (record) {
        // console.log(record.bins)
        arr.push(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function (record) {
        console.log(arr.length);
        if (arr.length === 0) {
          var search_lists = [];
          var search_posts = [];

          const client = await getAerospikeClient();
          let query1 = client.query(
            process.env.CLUSTER_NAME,
            process.env.SET_POSTS_SEARCH
          );
          const stream1 = query1.foreach();

          stream1.on("data", function (record) {
            search_lists.push(record.bins);
          });

          stream1.on("end", function (record) {
            console.log(search_lists);
            search_lists = search_lists.sort((a, b) => b.p_c - a.p_c);
            // return res.status(200).json({ isSearch: true, search_lists });
            resolve({ isSearch: true, search_lists });
          });
        } else {
          var temp = arr.sort((a, b) => b.p_c - a.p_c);
          // return res.status(200).json({ isSearch: false, temp });
          resolve({ isSearch: false, temp });
        }
      });
    });
  }

  async socialDonationHistory(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_EARNING
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("postId", id));
      const stream = query.foreach();
      let arr = [];

      stream.on("data", async function (record) {
        arr.push(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function (record) {
        // Sort according to the amount
        // arr = arr.slice((a, b) => Number(a.amount) - Number(b.amount))
        arr = arr.slice((a, b) => b.Number(id) - a.Number(id));
        var temp = arr.slice(0, 5);
        resolve(temp);
      });
    });
  }

  async fetchDonationDetails(id) {
    const earn_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_EARNING,
      id
    );
    const client = await getAerospikeClient();
    var data = await client.get(earn_key);
    // console.log(data);
    return data;
  }

  async socialSharePost(id, data, user) {
    const client = await getAerospikeClient();
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post_id = now.micro();
    const share_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      post_id.toString()
    );
    // *** share post meta table
    const share_post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      post_id.toString()
    );
    // *** Share post comment table
    const share_post_comment = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      post_id.toString()
    );

    var batchArrKeys = [
      post_key,
      share_post_key,
      share_post_meta_key,
      share_post_comment,
    ];
    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchRecords = [];

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (
        batchArrKeys[i].set === process.env.SET_POSTS &&
        batchArrKeys[i].key.toString() === id.toString()
      ) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("share_c", 1)],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("o_p_id", data.originalPost.id), // original post id
            Aerospike.operations.write(
              "content",
              data.originalPost.content || ""
            ), // original post content
            Aerospike.operations.write("image", data.originalPost.image || ""), // original post content
            Aerospike.operations.write("gif", data.originalPost.gif || ""), // original post content
            Aerospike.operations.write("l_c", 0), // share post like count
            Aerospike.operations.write("book", []), // share post bookmark count
            Aerospike.operations.write("pinned", 0), // share post pinned status
            Aerospike.operations.write("u_id", data.originalPost.u_id), // original post u_id
            Aerospike.operations.write("u_fn", data.originalPost.u_fn), // original post u fn
            Aerospike.operations.write("u_ln", data.originalPost.u_ln), // original post u ln
            Aerospike.operations.write("u_dun", data.originalPost.u_dun), // original post u_dun
            Aerospike.operations.write("u_img", data.originalPost.u_img), // original post u_img
            Aerospike.operations.write("hide", []), // share post hide count
            Aerospike.operations.write("s_c", 0), // share post spam count
            Aerospike.operations.write("c_t", []), // share post bookmark count
            Aerospike.operations.write("postOf", data.originalPost.postOf), // define what type of post
            Aerospike.operations.write("is_share", 1), // if is_share>0 then it's a share post otherwise normal post
            Aerospike.operations.write("s_u_id", user.u_id),
            Aerospike.operations.write("s_u_fn", user.fn),
            Aerospike.operations.write("s_u_ln", user.ln),
            Aerospike.operations.write("s_u_dun", user.handleUn),
            Aerospike.operations.write("s_u_img", user.p_i),
            Aerospike.operations.write("s_content", data.content || ""),
            Aerospike.operations.write("pop", []),
            Aerospike.operations.write("ran", []),
            Aerospike.operations.write("c_t", new Date().getTime()), //current post time
            Aerospike.operations.write("u_t", new Date().getTime()),
            //is_share
            Aerospike.operations.write("is_share", true),
          ],
        });
      }
      // create meta table for share post
      else if (batchArrKeys[i].set === process.env.SET_POSTS_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("likes", []), // Post likes
            Aerospike.operations.write("dislikes", []), // post dislikes
            Aerospike.operations.write("haha", []), // Post haha
            Aerospike.operations.write("angry", []), // Post angry

            Aerospike.operations.write("party", []), // Post party

            Aerospike.operations.write("spam", []), // post spam
            Aerospike.operations.write("share", []), //post share
            Aerospike.operations.write("analytics", {}), // Post analytics
            Aerospike.operations.write("flwr_incr", 0), // Follwers gain
            Aerospike.operations.write("cmnts", 0), //post comments share
          ],
        });
      }
      // create a comment table for meta post
      else if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.write("pid", post_id)],
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      var getPostData = await client.get(post_key);
      // *** Send notification to the main user
      const map_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        data.originalPost.u_dun
      );
      var notificationData = {
        id: post_id,
        ty: 7,
        vi: false,
        wo: user.handleUn,
        ti: Date.now(),
        nm: `${user.fn} ${user.ln}`,
        pi: user.p_i,
        cat: 1,
        re: data.originalPost.u_dun,
      };

      if (data.originalPost.u_dun !== user.handleUn) {
        const map_ops = [
          Aerospike.operations.write("n_id", data.originalPost.u_dun),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
        return {
          post: getPostData.bins,
          notificationData: notificationData,
        };
      } else {
        return getPostData.bins;
      }
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async socialSharePostPrivacy(id, data) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const ops = [Aerospike.operations.write("shr_prv", data.sharePrivacy)];
    client.operate(key, ops, async (err, result) => {
      if (err) {
        throw createError.BadRequest(err.message);
      } else {
        // return res.status(200).json({ msg: "Post privacy has been updated" });
        return { msg: "Post privacy has been updated" };
      }
    });
  }

  async socialCommentPostPrivacy(id, data) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const ops = [Aerospike.operations.write("cmnt_prv", data.commentPrivacy)];
    client.operate(key, ops, async (err, result) => {
      if (err) {
        throw createError.BadRequest(err.message);
      } else {
        return { msg: "Post privacy has been updated" };
      }
    });
  }

  async socialPostToNft(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS,
        id
      );

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("postId", id));
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        arr.push(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function (record) {
        // console.log(arr);
        var temp = arr.sort((a, b) => b.l_c - a.l_c);
        const data = await client.get(post_key);
        const comment = temp[0];
        try {
          resolve({ post: data.bins, comment: comment });
        } catch (error) {
          throw createError.Conflict(error.message);
        }
      });
    });
  }

  async socialFetchFullPost(id) {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const client = await getAerospikeClient();
    const post = await client.get(post_key);
    try {
      return post;
    } catch (error) {
      throw createError.Conflict(error.message);
    }
  }

  async createSocialNewPost(user, data, file, query) {
    console.log(">>>> came here <<<<");
    if (data.content) {
      var arr = data.content.split(" ");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].includes("https://" || "http://" || "www.")) {
          var url = arr[i];
          arr.splice(i, 1);
        }
      }
      data.content = arr.join(" ");
    }
    const post_id = now.micro();
    var metions = "";
    const postArr = data.content.split(" ");
    for (let i = 0; i < postArr.length; i++) {
      if (postArr[i].includes("@")) {
        metions = postArr[i].replace("@", "").replace("[", "").replace("]", "");
      }
    }

    var publicURL;
    if (file) {
      const result = await uploadImage(file);
      console.log("Result ", result);
      publicURL = result;
    }

    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const oldString = data.content
      .trim()
      .replace(/(\r\n|\n|\r|(  ))/gm, " ")
      .split(" ");
    const newString = removeStopwords(oldString, eng);
    const post_content = data.content ? data.content : "";
    const post_gif = data.gif ? data.gif : "";

    // *** Create post key (FEED)
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      post_id.toString()
    );
    // *** Create post key (MAIN)
    const main_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_POSTS,
      post_id.toString()
    );
    // *** Creating post meta key
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      post_id
    );
    const post_counter_ops = [
      Aerospike.operations.incr("cc", 1),
      Aerospike.operations.read("cc"),
    ];
    // const counterData = await client.operate(post_testmp_key, post_counter_ops);
    // *** Post comment table
    const post_comment = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      post_id.toString()
    );
    const user_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USER_META,
      user.handleUn
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});

    // **** Here we generate keys for TRENDING post
    let trending_key = [];
    var batchArrKeys = [];
    for (let i = 0; i < oldString.length; i++) {
      if (oldString[i].includes("#")) {
        trending_key.push(
          new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_TRENDING,
            oldString[i]
          )
        );
      }
    }
    // **** Here we generate keys for SEARCHING post
    var dstring = newString;
    // console.log(newString)
    var keys = [];
    for (let i = 0; i < dstring.length; i++) {
      var sstr = dstring[i].toLowerCase();
      keys.push(
        new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.POST_SEARCH,
          sstr
        )
      );
    }

    // *** Inserting all the keys inside batch array
    batchArrKeys = [
      post_key,
      main_post_key,
      post_meta_key,
      user_meta_key,
      trending_key,
      keys,
      post_comment,
    ];

    var batchRecords = [];

    for (let i = 0; i < batchArrKeys.length; i++) {
      // *** Main post
      if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("content", post_content || ""), // Post content
            Aerospike.operations.write("gif", post_gif || ""), // post gif
            Aerospike.operations.write("l_c", 0),
            Aerospike.operations.write("pinned", 0), // Post pinned
            Aerospike.operations.write("book", []), // post bookmark
            Aerospike.operations.write("u_id", user.u_id.toString()), // User ID,
            Aerospike.operations.write("u_fn", user.fn), // User firstname
            Aerospike.operations.write("u_ln", user.ln), // user lastname
            Aerospike.operations.write("u_dun", user.handleUn), // user handle username
            Aerospike.operations.write("u_img", user.p_i), // user profile pic
            Aerospike.operations.write("hide", []), // Hide
            Aerospike.operations.write("sp_c", 0), // post spam count
            Aerospike.operations.write("c_t", new Date().getTime()), //current post time
            Aerospike.operations.write("u_t", new Date().getTime()), // post updated time
            Aerospike.operations.write("c_c", 0), // post comment count
            Aerospike.operations.write("share_c", 0), // post share count
            Aerospike.operations.write("postOf", data.postOf),
            Aerospike.operations.write("privacy", data.privacy), // Post privacy
            Aerospike.operations.write("isPaid", data.isPaid), // Is this a paid post or not default is FALSE
            Aerospike.operations.write("cName", data.cName), // Promotion company name
            Aerospike.operations.write("country", data.country),
            Aerospike.operations.write("country", data.city),
            Aerospike.operations.write("blockId", data.blockId),
            Aerospike.operations.write("feeling", data.feeling),
            Aerospike.operations.write("feelingIcon", data.feelingIcon),
            Aerospike.operations.write("pop", []),
            Aerospike.operations.write("ran", []),
            Aerospike.operations.write("cmnt_prv", user.cmnt_prv || "all"),
            Aerospike.operations.write("statusText", data.statusText),
            Aerospike.operations.write("userLocation", data.userLocation),
            Aerospike.operations.write("image", publicURL || ""),
          ],
        });
      }
      // *** Save post ID inside user meta table
      else if (batchArrKeys[i].set === process.env.SET_USER_META) {
        console.log("Mention ", metions);
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.lists.append("posts", post_id), // user post list
            Aerospike.lists.append("metions", metions || ""),
          ],
        });
      }
      // *** Post meta
      else if (batchArrKeys[i].set === process.env.SET_POSTS_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("likes", []), // Post likes
            Aerospike.operations.write("dislikes", []), // post dislikes
            Aerospike.operations.write("haha", []), // Post haha
            Aerospike.operations.write("angry", []), // Post angry

            Aerospike.operations.write("party", []), // Post party

            Aerospike.operations.write("spam", []), // post spam
            Aerospike.operations.write("share", []), //post share
            Aerospike.operations.write("analytics", {}), // Post analytics
            Aerospike.operations.write("flwr_incr", 0), // Follwers gain
            Aerospike.operations.write("cmnts", 0), //post comments share
          ],
        });
      } else if (Array.isArray(batchArrKeys[i])) {
        if (batchArrKeys[i].length > 0) {
          // *** Trending
          if (batchArrKeys[i][0].set === process.env.SET_TRENDING) {
            let batchPolicy = new Aerospike.BatchPolicy({});
            let exists = await client.batchExists(batchArrKeys[i], batchPolicy);
            exists.forEach(async (result) => {
              var pk_word = result.record.key.key;
              if (result.status !== 0) {
                // console.log("Not exists");
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: result.record.key,
                  ops: [
                    Aerospike.operations.write("p_k", pk_word),
                    Aerospike.operations.write("p_c", 1),
                    Aerospike.lists.append("p_l", post_id.toString()), // user post list
                  ],
                });
              } else {
                // console.log("Alredy exists");
                batchRecords.push({
                  type: batchType.BATCH_WRITE,
                  key: result.record.key,
                  ops: [
                    //if exists, append
                    Aerospike.lists.append("p_l", post_id.toString()),
                    Aerospike.operations.incr("p_c", 1),
                  ],
                });
              }
            });
          }
          // *** Post search
          else {
            let batchPolicy = new Aerospike.BatchPolicy({});
            let exists = await client.batchExists(batchArrKeys[i], batchPolicy);
            exists.forEach(async (result) => {
              var pk_word = result.record.key.key; //primary key
              var shortKey = pk_word.slice(0, 2).toLowerCase();
              // var timestmp = new Date().getTime().toString()
              var pid = `${post_id}`; //post id to append
              if (query.flwr_count > 0) {
                // console.log("Celb");
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
      // *** Post comment
      else if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("pid", post_id), // user post list
          ],
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      const bins = {
        id: post_id,
        content: post_content || "",
        gif: post_gif || "",
        l_c: 0,
        pinned: 0,
        book: [],
        u_id: user.u_id.toString(),
        u_fn: user.fn,
        u_ln: user.ln,
        u_dun: user.handleUn,
        u_img: user.p_i,
        hide: [],
        sp_c: 0,
        c_t: new Date().getTime(),
        u_t: new Date().getTime(),
        c_c: 0,
        share_c: 0,
        postOf: data.postOf,
        privacy: data.privacy,
        isPaid: data.isPaid,
        cName: data.cName,
        country: data.country,
        blockId: data.blockId,
        feeling: data.feeling,
        feelingIcon: data.feelingIcon,
        pop: [],
        ran: [],
        cmnt_prv: user.cmnt_prv || "all",
        statusText: data.statusText,
        userLocation: data.userLocation,
        image: publicURL || "",
      };
      // Define the TTL value in seconds
      const ttl = 1000; // 1 sec

      // Set the TTL option in the write policy
      const writePolicy = new Aerospike.WritePolicy({
        ttl: ttl,
      });
      const result = await client.put(post_key, bins, writePolicy);
      try {
        const user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          user.handleUn
        );
        const user_ops = [Aerospike.operations.incr("post_c", 1)];
        const user_postCount = await client.operate(user_key, user_ops);
        try {
          console.log("HERE >>");
          if (!metions.trim()) {
            var getPostData = await client.get(post_key);
            console.log("** ", getPostData);
            return getPostData.bins;
          } else {
            const key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_USER_META,
              metions
            );
            const ops = [Aerospike.lists.append("metions", post_id)];
            client.operate(key, ops, async (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                var getPostData = await client.get(post_key);
                console.log("** ", getPostData);
                return getPostData.bins;
              }
            });
          }
        } catch (err) {
          throw createError.BadRequest(err.message);
        }
      } catch (err) {
        throw createError.BadRequest(err.message);
      }
    } catch (err) {
      throw createError.BadRequest(err.message);
    }
  }

  async fetchSocialPostWithComment(handleUn, id, page, limit, sortedBy) {
    return new Promise(async (resolve, reject) => {
      const post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS,
        id
      );
      const client = await getAerospikeClient();
      const post = await client.get(post_key);
      // console.log(post.bins);
      const batchType = Aerospike.batchType;
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );

      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("postId", id));
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        if (id === record.bins.postId) {
          arr.push(record.bins);
        }
      });
      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        if (sortedBy === "old") {
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = arr.slice(start, end);
          resolve({ post: post, comment: data });
        } else if (sortedBy === "pop ") {
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = arr.slice(start, end);
          resolve({ post: post.bins, comment: data });
        } else {
          var temp = arr.sort((a, b) => b.id - a.id);
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = arr.slice(start, end);
          resolve({ post: post.bins, comment: data });
        }
      });
    });
  }

  /***
   * @SOCIAL_POST_COMMENT
   */

  async createPostComment(id, user, value, file, query) {
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const comment_id = now.micro();
    var publicURL;
    if (file) {
      const result = await uploadImage(file);
      console.log("Result ", result);
      publicURL = result;
    }

    // *** Create post key (FEED)
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post = await client.get(post_key);
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );
    // *** Create post key (MAIN)
    const main_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_POSTS,
      id
    );
    // *** Create post comment key
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      comment_id
    );
    // *** Create post meta comment key
    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      comment_id
    );
    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [];
    batchArrKeys = [
      post_comment_key,
      post_comment_meta_key,
      main_post_key,
      post_key,
      post_meta_key,
    ];
    var batchRecords = [];

    for (let i = 0; i < batchArrKeys.length; i++) {
      console.log("SET NAME: ", batchArrKeys[i].set);
      if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", comment_id),
            Aerospike.operations.write("comment", value.comment || ""),
            Aerospike.operations.write("gif", value.gif || ""),
            Aerospike.operations.write("l_c", 0),
            Aerospike.operations.write("d_c", 0),
            Aerospike.operations.write("s_c", 0),
            Aerospike.operations.write("hide", 0),
            Aerospike.operations.write("c_t", new Date().getTime()),
            Aerospike.operations.write("u_t", new Date().getTime()),
            Aerospike.operations.write("c_fn", user.fn),
            Aerospike.operations.write("c_ln", user.ln),
            Aerospike.operations.write("c_u_du", user.handleUn),
            Aerospike.operations.write("c_u_img", user.p_i),
            Aerospike.operations.write("pinn", false),
            Aerospike.operations.write("delete", false),
            Aerospike.operations.write("reply_c", 0),
            Aerospike.operations.write("postId", id),
            Aerospike.operations.write("img", publicURL || ""),
          ],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POST_COMMENT_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", comment_id),
            Aerospike.operations.write("likes", []),
            Aerospike.operations.write("dislikes", []),
            Aerospike.operations.write("haha", []),
            Aerospike.operations.write("angry", []),
            Aerospike.operations.write("spam", []),
          ],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("c_c", 1)],
        });
      } else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("c_c", 1)],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POSTS_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("cmnts", +1)],
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    const data = await client.get(post_comment_key);
    try {
      if (user.handleUn !== post.bins.u_dun) {
        // *** save notification data
        const map_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_APP_HISTORY,
          post.bins.u_dun
        );
        const notificationData = {
          id: id,
          ty: 2,
          vi: false,
          wo: user.handleUn,
          ti: Date.now(),
          nm: `${user.fn} ${user.ln}`,
          pi: user.p_i,
          re: post.bins.u_dun,
        };
        const map_ops = [
          Aerospike.operations.write("n_id", post.bins.u_dun),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
        return { comment: data.bins, notificationData };
      } else {
        return data.bins;
      }
    } catch (error) {
      throw createError.Conflict({ msg: error.message });
    }
  }

  async socialPinnedComment(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT,
        id
      );
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        // console.log(data);
        if (data.pinn) {
          const ops = [Aerospike.operations.write("pinn", false)];
          client.operate(post_comment_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              resolve({ msg: "Unpinned comment" });
            }
          });
        } else {
          const ops = [Aerospike.operations.write("pinn", true)];
          client.operate(post_comment_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              resolve({ msg: "Pinned comment" });
            }
          });
        }
      });
    });
  }

  async socialDeleteComment(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT,
        id
      );
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        if (!data.delete) {
          const ops = [Aerospike.operations.write("delete", true)];
          const post_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_POSTS,
            data.postId
          );

          // *** Create post key (MAIN)
          const main_post_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_MAIN_POSTS,
            data.postId
          );

          client.operate(post_comment_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              const ops = [Aerospike.operations.incr("c_c", -1)];
              client.operate(post_key, ops, (err, result) => {
                if (err) {
                  throw createError.Conflict(err.message);
                } else {
                  const ops = [Aerospike.operations.incr("c_c", -1)];
                  client.operate(main_post_key, ops, (err, result) => {
                    if (err) {
                      throw createError.Conflict(err.message);
                    } else {
                      resolve({ msg: "Comment deleted" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  async socialEditComment(id, value) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();

      const post_comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT,
        id
      );

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );

      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        const ops = [Aerospike.operations.write("comment", value.text)];
        client.operate(post_comment_key, ops, (err, result) => {
          if (err) {
            throw createError.Conflict(err.message);
          } else {
            resolve({ msg: "Comment updated" });
          }
        });
      });
    });
  }

  async socialSpamComment(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      console.log("My comment ID: ", id);

      const post_comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT,
        id
      );

      const post_comment_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT_META,
        id
      );

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT_META
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        console.log("Data came ", record.bins);
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        if (data.spam.includes(handleUn)) {
          const ops = [Aerospike.lists.removeByValue("spam", handleUn)];
          client.operate(post_comment_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.operations.incr("s_c", -1)];
              client.operate(post_comment_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  resolve({ msg: "Comment spam removed" });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("spam", handleUn)];
          client.operate(post_comment_meta_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              const ops = [Aerospike.operations.incr("s_c", 1)];
              client.operate(post_comment_key, ops, (err, result) => {
                if (err) {
                  throw createError.Conflict(err.message);
                } else {
                  resolve({ msg: "Comment spam" });
                }
              });
            }
          });
        }
      });
    });
  }

  async socialLikeComment(id, username, type, user) {
    if (!id || !username || !type) {
      throw createError.Conflict({ msg: "Invalid request" });
    } else {
      var batchRecords = [];
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();
      const post_comment_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT,
        id
      );

      const post_comment_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT_META,
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
            commentMetaOps = [
              Aerospike.lists.append("dislikes", user.handleUn),
            ];
          }
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("dislikes", user.handleUn)];
        }
      } else if (type === "haha") {
        if (commentData.bins.l_c > 0) {
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
        if (commentData.bins.l_c > 0) {
          if (commentMetaData.bins.angry.includes(user.handleUn)) {
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
        if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
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
            ty: 4,
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
      } catch (error) {
        throw createError.Conflict(error.message);
      }
    }
  }

  async socialRemoveLikeComment(id, handleUn) {
    var batchRecords = [];
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      id
    );
    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      id
    );
    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [post_comment_key, post_comment_meta_key];
    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
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
    } catch (error) {
      throw createError.Conflict(error.message);
    }
  }

  async fetchSocialComments(id, handleUn, sortedBy, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const batchType = Aerospike.batchType;
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );

      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("postId", id));
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        // if (handleUn !== record.bins.c_u_du) {
        //   arr.push(record.bins);
        // }
        arr.push(record.bins);
      });
      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        if (sortedBy === "old") {
          var temp = arr.sort((a, b) => a.id - b.id);
          // const page = page;
          // const limit = limit;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else if (sortedBy === "pop ") {
          var temp = arr.sort((a, b) => b.l_c - a.l_c);
          const page = page;
          // const limit = limit;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else {
          var temp = arr.sort((a, b) => b.id - a.id);
          // const page = page;
          // const limit = limit;

          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        }
      });
    });
  }

  async fetchSocialMyComments(id, handleUn, sortedBy, page, limit) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const batchType = Aerospike.batchType;
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_COMMENT
      );

      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("postId", id));
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        // if (handleUn === record.bins.c_u_du) {
        //   arr.push(record.bins);
        // }
        arr.push(record.bins);
      });
      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", async function () {
        if (sortedBy === "old") {
          var temp = arr.sort((a, b) => a.id - b.id);
          // const page = page;
          // const limit = limit;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else if (sortedBy === "pop ") {
          var temp = arr.sort((a, b) => b.l_c - a.l_c);
          const page = page;
          // const limit = limit;
          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        } else {
          var temp = arr.sort((a, b) => b.id - a.id);
          // const page = page;
          // const limit = limit;

          var start = (page - 1) * limit;
          var end = page * limit;
          var data = temp.slice(start, end);
          resolve(data);
        }
      });
    });
  }

  /**
   * @POST_COMMENT_REPLY
   */

  async socialCreatReply(id, data, user) {
    const reply_id = now.micro();
    const client = await getAerospikeClient();
    const batchType = Aerospike.batchType;

    const post_comment_reply_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      reply_id
    );
    const post_comment_reply_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      reply_id
    );
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      id
    );
    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      id
    );
    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [];

    batchArrKeys = [
      post_comment_reply_key,
      post_comment_reply_meta_key,
      post_comment_key,
      post_comment_meta_key,
    ];
    var batchRecords = [];
    const commentData = await client.get(post_comment_key);
    console.log("********* Comment Data: ", commentData.bins.c_u_du);

    for (let i = 0; i < batchArrKeys.length; i++) {
      if (batchArrKeys[i].set === process.env.SET_POST_REPLY) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", reply_id), // id (index)
            Aerospike.operations.write("content", data.text), // content
            Aerospike.operations.write("l_c", 0), // like count
            Aerospike.operations.write("d_c", 0), // dislike count
            Aerospike.operations.write("s_c", 0), // spam count
            Aerospike.operations.write("r_u_fn", user.fn), // user first name
            Aerospike.operations.write("r_u_ln", user.ln), // user last name
            Aerospike.operations.write("r_u_dun", user.handleUn), // user handle username
            Aerospike.operations.write("r_u_pic", user.p_i), // user profile picture
            Aerospike.operations.write("cmntId", id), // comment id (index)
            Aerospike.operations.write("delete", false), // comment id (index)
          ],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POST_REPLY_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", reply_id), // id (index)
            Aerospike.operations.write("likes", []), // like count
            Aerospike.operations.write("dislikes", []), // dislike count
            Aerospike.operations.write("spam", []), // spam count
          ],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.operations.incr("reply_c", 1)],
        });
      } else if (batchArrKeys[i].set === process.env.SET_POST_COMMENT_META) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [Aerospike.lists.append("reply", reply_id)],
        });
      }
    }
    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      const data = await client.get(post_comment_reply_key);
      try {
        // return res.status(400).json(data.bins);
        if (commentData.bins.c_u_du !== user.handleUn) {
          // *** save notification data
          const map_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_APP_HISTORY,
            commentData.bins.c_u_du
          );
          const notificationData = {
            id: commentData.bins.postId,
            ty: 5,
            vi: false,
            wo: user.handleUn,
            ti: Date.now(),
            nm: `${user.fn} ${user.ln}`,
            pi: user.p_i,
            cat: 0,
            re: commentData.bins.c_u_du,
          };
          const map_ops = [
            Aerospike.operations.write("n_id", commentData.bins.c_u_du),
            Aerospike.maps.put("notification", Date.now(), notificationData, {
              order: maps.order.KEY_ORDERED,
            }),
            Aerospike.operations.incr("count", 1),
          ];
          let result = await client.operate(map_key, map_ops);
          return { reply: data.bins, notificationData };
        } else {
          return { reply: data.bins };
        }
      } catch (error) {
        throw createError.Conflict(error.message);
      }
    } catch (error) {
      throw createError.Conflict(error.message);
    }
  }

  async socialFetchCommentReply(id, page, limit, sortedBy) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const batchType = Aerospike.batchType;
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("cmntId", id));
      const stream = query.foreach();
      const arr = [];
      stream.on("data", function (record) {
        console.log(record.bins.cmntId, id);
        arr.push(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        // console.log(arr);
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = arr.slice(start, end);
        resolve(data);
      });
    });
  }

  async socialHideReply(id, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_comment_reply_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY,
        id
      );

      const post_comment_reply_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY_META,
        id
      );
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY_META
      );
      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", req.params.id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        if (data.spam.includes(handleUn)) {
          const ops = [Aerospike.lists.removeByValue("spam", handleUn)];
          client.operate(post_comment_reply_meta_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              const ops = [Aerospike.operations.incr("s_c", -1)];
              client.operate(post_comment_reply_key, ops, (err, result) => {
                if (err) {
                  throw createError.Conflict(err.message);
                } else {
                  resolve({ msg: "Reply spam removed" });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("spam", handleUn)];
          client.operate(post_comment_reply_meta_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              const ops = [Aerospike.operations.incr("s_c", 1)];
              client.operate(post_comment_reply_key, ops, (err, result) => {
                if (err) {
                  throw createError.Conflict(err.message);
                } else {
                  resolve({ msg: "Reply spam" });
                }
              });
            }
          });
        }
      });
    });
  }

  async socialDeleteReply(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const post_reply_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY,
        id
      );
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POST_REPLY
      );

      const tempBin1 = "ExpVar";
      query.where(Aerospike.filter.equal("id", id));
      const stream = query.foreach();
      var data;

      stream.on("data", function (record) {
        data = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        if (!data.delete) {
          const ops = [Aerospike.operations.write("delete", true)];

          client.operate(post_reply_key, ops, (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              const post_comment_key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_POST_COMMENT,
                data.cmntId
              );
              const ops = [Aerospike.operations.incr("reply_c", -1)];
              client.operate(post_comment_key, ops, (err, result) => {
                if (err) {
                  throw createError.Conflict(err.message);
                } else {
                  resolve({ msg: "Comment deleted" });
                }
              });
            }
          });
        }
      });
    });
  }

  async socialLikeReply(id, user) {
    const client = await getAerospikeClient();
    const reply_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      id
    );
    const reply_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      id
    );
    const reply = await client.get(reply_comment_key);
    console.log(reply.bins);
    const comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      reply.bins.cmntId
    );

    const commentData = await client.get(comment_key);
    const replyMeta = await client.get(reply_meta_key);
    if (reply.bins.l_c > 0) {
      if (replyMeta.bins.likes.includes(user.handleUn)) {
        const listOps = [Aerospike.lists.removeByValue("likes", user.handleUn)];
        client.operate(reply_meta_key, listOps, (err, result) => {
          if (err) {
            throw createError.Conflict(err.message);
          } else {
            // reply_comment_key
            const decLike = [Aerospike.operations.incr("l_c", -1)];
            client.operate(reply_comment_key, decLike, (err, ops) => {
              if (err) {
                throw createError.Conflict(err.message);
              } else {
                return { msg: "Like removed" };
              }
            });
          }
        });
      } else {
        const listOps1 = [
          Aerospike.lists.removeByValue("dislikes", user.handleUn),
        ];
        client.operate(reply_meta_key, listOps1, (err, result) => {
          if (err) {
            throw createError.Conflict(err.message);
          } else {
            const countDec = [Aerospike.operations.incr("d_c", -1)];
            client.operate(reply_comment_key, countDec, (err, result) => {
              if (err) {
                throw createError.Conflict(err.message);
              } else {
                const listOps2 = [
                  Aerospike.lists.append("likes", user.handleUn),
                ];
                client.operate(
                  reply_meta_key,
                  listOps2,
                  async (err, result) => {
                    if (err) {
                      throw createError.Conflict(err.message);
                    } else {
                      const incrLike = [Aerospike.operations.incr("l_c", 1)];
                      client.operate(
                        reply_comment_key,
                        incrLike,
                        async (err, result) => {
                          if (err) {
                            throw createError.Conflict(err.message);
                          } else {
                            if (commentData.bins.c_u_du === user.handleUn) {
                              return { msg: "I liked my reply" };
                            } else {
                              // **** Reply like notification
                              const map_key = new Aerospike.Key(
                                process.env.CLUSTER_NAME,
                                process.env.SET_APP_HISTORY,
                                commentData.bins.c_u_du
                              );
                              const notificationData = {
                                id: commentData.bins.c_u_du,
                                ty: 6,
                                vi: false,
                                wo: user.handleUn,
                                ti: Date.now(),
                                nm: `${user.fn} ${user.ln}`,
                                pi: user.p_i,
                                cat: 1,
                                re: commentData.bins.c_u_du,
                              };
                              const map_ops = [
                                Aerospike.operations.write(
                                  "n_id",
                                  commentData.bins.c_u_du
                                ),
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
                              let result = await client.operate(
                                map_key,
                                map_ops
                              );
                              return {
                                msg: "You like this reply",
                                notificationData,
                              };
                            }
                          }
                        }
                      );
                    }
                  }
                );
              }
            });
          }
        });
      }
    } else {
      const listOps = [Aerospike.lists.append("likes", user.handleUn)];
      client.operate(reply_meta_key, listOps, (err, result) => {
        if (err) {
          throw createError.Conflict(err.message);
        } else {
          const ops = [Aerospike.operations.incr("l_c", 1)];
          client.operate(reply_comment_key, ops, async (err, result) => {
            if (err) {
              throw createError.Conflict(err.message);
            } else {
              if (reply.bins.cmntId === user.handleUn) {
                return { msg: "I liked my reply" };
              } else {
                // **** Reply like notification
                const map_key = new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_APP_HISTORY,
                  commentData.bins.c_u_du
                );
                const notificationData = {
                  id: commentData.bins.c_u_du,
                  ty: 6,
                  vi: false,
                  wo: user.handleUn,
                  ti: Date.now(),
                  nm: `${user.rfn} ${user.rln}`,
                  pi: user.p_i,
                  cat: 1,
                  re: commentData.bins.c_u_du,
                };
                const map_ops = [
                  Aerospike.operations.write("n_id", commentData.bins.c_u_du),
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
                return {
                  msg: "You like this reply",
                  notificationData,
                };
              }
            }
          });
        }
      });
    }
  }
}

module.exports = new PostModel();

// throw createError.Conflict(error.message);
// throw createError.Conflict(err.message);
