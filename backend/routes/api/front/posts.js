/** @format */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const maps = Aerospike.maps;
const { getAerospikeClient } = require("../../../aerospike");
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");
const batchType = Aerospike.batchType;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 75 * 1024 * 1024,
  },
});

router.get("/", async (req, res, next) => {
  console.log(req.query.sortedBy);
  const client = await getAerospikeClient();
  const key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_USER_META,
    req.user.handleUn
  );
  const user_meta = await client.get(key);
  // console.log(user_meta.bins.flw)

  var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
  query.where(Aerospike.filter.equal("u_dun", req.user.handleUn));
  var stream = query.foreach();
  var arr = [];
  stream.on("data", async (data) => {
    console.log(user_meta.bins);
    // if (data.bins.u_dun === req.user.handleUn) {
    //   arr.push(data.bins)
    // }
    // else {
    //   for (let i = 0; i < user_meta.bins.flw.length > 0; i++) {
    //     if (data.bins.u_dun === user_meta.bins.flw[i]) {
    //       arr.push(data.bins)
    //     }
    //   }
    // }
  });

  const test = "hello test";

  stream.on("end", function (posts) {
    if (req.query.sortedBy === "old") {
      var temp = arr.sort((a, b) => a.c_t - b.c_t);
      return res.status(200).json({ posts: temp });
    } else if (req.query.sortedBy === "popular") {
      var temp = arr.sort((a, b) => b.l_c - a.l_c);
      return res.status(200).json({ posts: temp });
    } else {
      var temp = arr.sort((a, b) => b.c_t - a.c_t);
      return res.status(200).json({ posts: temp });
    }
  });
});

router.get("/:id", async (req, res, next) => {
  const postId = req.params.id;
  const client = await getAerospikeClient();
  if (!postId) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    var post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      postId
    );
    client
      .exists(post_key)
      .then(async (data) => {
        // console.log(data);
        if (data) {
          var data = await client.get(post_key);

          try {
            console.log(data.bins);
            return res.status(200).json(data.bins);
          } catch (err) {
            return res.status(401).json({ msg: err.message });
          }
        }
      })
      .catch((err) => {
        return res.status(401).json({ msg: err.message });
      });
  }
});

// *** Main Create post api *** //
router.post("/", multer.single("image"), async (req, res, next) => {
  var url;
  const oldString = req.body.content
    .trim()
    .replace(/(\r\n|\n|\r|(  ))/gm, " ")
    .split(" ");
  const newString = removeStopwords(oldString, eng);
  const client = await getAerospikeClient();
  const post_id = now.micro();
  console.log(req.body.content);

  if (req.body.content) {
    console.log(req.body.content);
    var arr = req.body.content.split(" ");
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].includes("https://" || "http://" || "www.")) {
        var url = arr[i];
        arr.splice(i, 1);
      }
    }
    req.body.content = arr.join(" ");
  }
  const batchType = Aerospike.batchType;
  // var batchSize = 2;
  var policy = new Aerospike.WritePolicy({
    totalTimeout: 50000,
    socketTimeout: 50000,
    maxRetries: 2,
  });
  const post_testmp_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.POST_COUNTER_KEY,
    "post_counter"
  );

  // *** Creating post key
  const post_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_POSTS,
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
  const counterData = await client.operate(post_testmp_key, post_counter_ops);

  // *** Poct comment table
  const post_comment = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_POST_COMMENT,
    post_id.toString()
  );

  // Only text content
  if (!req.file) {
    if (!url) {
      const post_bins = {
        id: post_id.toString(),
        content: req.body.content,
        gif: req.body.gif,
        l_c: 0, // Like count
        d_c: 0, // Dislike count
        book: [], // Bookmark
        pinned: 0,
        u_id: req.user.u_id.toString(), // User id
        u_fn: req.user.fn, // Post user first name
        u_ln: req.user.ln, // Posted user last name
        u_dun: req.user.handleUn, // Post user display username
        u_img: req.user.p_i, // Post user profile image
        hide: [], // hold userId those who hide this post
        s_c: 0, // spam count
        c_t: new Date().getTime().toString(), // Post time
        u_t: new Date().getTime().toString(), // Post update time
        c_c: 0, // Comment count related to the post
        s_c: 0, // Share count..
        is_share: 0,
        is_poll: false,
        cc: counterData.bins.cc,
      };
      // *** Post meta bin
      const post_meta_bins = {
        id: post_id.toString(),
        likes: [],
        heart: [],
        haha: [],
        party: [],
        dislikes: [],
        spam: [],
        share: [],
      };
      const post_comment_bins = {
        pid: post_id,
      };
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        req.user.handleUn
      );
      const user_meta_ops = [
        Aerospike.lists.append(process.env.SET_POSTS, post_id),
      ];
      await client.put(post_meta_key, post_meta_bins);
      await client.put(post_key, post_bins);
      await client.put(post_comment, post_comment_bins);
      await client.operate(user_key, user_meta_ops);

      const batchType = Aerospike.batchType;
      // Create a new batch policy
      let batchPolicy = new Aerospike.BatchPolicy({});
      let keys = [];
      var dstring = newString;
      for (i = 0; i < dstring.length; i++) {
        var sstr = dstring[i];
        keys.push(
          new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.POST_SEARCH,
            sstr
          )
        );
      }

      let exists = await client.batchExists(keys, batchPolicy);
      var batchRecords = [];

      exists.forEach(async (result) => {
        var pk_word = result.record.key.key; //primary key
        var shortKey = pk_word.slice(0, 2).toLowerCase();
        // var timestmp = new Date().getTime().toString()
        var pid = `${post_id}`; //post id to append
        var newKey = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_POSTS_SEARCH,
          pk_word
        );
        if (req.query.flwr_count > 0) {
          if (result.status !== 0) {
            //console.info('Key: %o does not exist', result.record.key.key);
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: newKey,
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
              key: newKey,
              ops: [
                //if exists, append
                Aerospike.lists.append("celb_p_l", pid),
                Aerospike.operations.incr("celb_c", 1),
              ],
            });
          }
        } else {
          // console.log("Normal user posting");
          if (result.status !== 0) {
            //console.info('Key: %o does not exist', result.record.key.key);
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: newKey,
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
              key: newKey,
              ops: [
                //if exists, append
                Aerospike.lists.append("u_p_l", pid),
                Aerospike.operations.incr("u_c", 1),
              ],
            });
          }
        }
      });

      // Create the batch write policy
      let batchWritePolicy = new Aerospike.BatchWritePolicy({
        // An example that will always return true
        //filterExpression: exp.gt(exp.int(2), exp.int(1))
      });
      //=========== Trending post save ============//
      // const batchType1 = Aerospike.batchType;
      let batchPolicy1 = new Aerospike.BatchPolicy({});
      let keys1 = [];
      for (let i = 0; i < oldString.length; i++) {
        if (oldString[i].includes("#")) {
          keys1.push(
            new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_TRENDING,
              oldString[i]
            )
          );
        }
      }
      let exists1 = await client.batchExists(keys1, batchPolicy1);
      var batchRecords1 = [];
      exists1.forEach(async (result) => {
        var pk_word = result.record.key.key;
        var pid = `${post_id}`; //post id to append
        var newKey1 = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_TRENDING,
          pk_word
        );
        if (result.status !== 0) {
          //console.info('Key: %o does not exist', result.record.key.key);
          batchRecords.push({
            type: batchType.BATCH_WRITE,
            key: newKey1,
            ops: [
              Aerospike.operations.write("p_k", pk_word),
              Aerospike.operations.write("p_c", 1),
              Aerospike.lists.append("p_l", pid), // user post list
            ],
          });
        } else {
          batchRecords.push({
            type: batchType.BATCH_WRITE,
            key: newKey1,
            ops: [
              //if exists, append
              Aerospike.lists.append("p_l", pid),
              Aerospike.operations.incr("p_c", 1),
            ],
          });
        }
      });
      await client.batchWrite(batchRecords, batchPolicy);

      try {
        await client.batchWrite(batchRecords1, batchPolicy1);
        var getPostData = await client.get(post_key);
        return res.status(201).json(getPostData.bins);
      } catch (error) {
        return res.status(401).json({ msg: error.message });
      }
    } else {
      {
        const post_bins = {
          id: post_id.toString(),
          content: req.body.content,
          gif: req.body.gif,
          url: url,
          l_c: 0, // Like count
          d_c: 0, // Dislike count
          book: [], // Bookmark
          pinned: 0,
          u_id: req.user.u_id.toString(), // User id
          u_fn: req.user.fn, // Post user first name
          u_ln: req.user.ln, // Posted user last name
          u_dun: req.user.handleUn, // Post user display username
          u_img: req.user.p_i, // Post user profile image
          hide: [], // hold userId those who hide this post
          s_c: 0, // spam count
          c_t: new Date().getTime().toString(), // Post time
          u_t: new Date().getTime().toString(), // Post update time
          c_c: 0, // Comment count related to the post
          s_c: 0, // Share count..
          is_share: 0,
          is_poll: false,
          cc: counterData.bins.cc,
        };
        // *** Post meta bin
        const post_meta_bins = {
          id: post_id.toString(),
          likes: [],
          heart: [],
          haha: [],
          party: [],
          dislikes: [],
          spam: [],
          share: [],
        };
        const post_comment_bins = {
          pid: post_id,
        };
        await client.put(post_meta_key, post_meta_bins);
        await client.put(post_key, post_bins);
        await client.put(post_comment, post_comment_bins);

        const batchType = Aerospike.batchType;
        // Create a new batch policy
        let batchPolicy = new Aerospike.BatchPolicy({
          // An example that will always return true
          //filterExpression: exp.eq(exp.str(2), exp.int(1))
        });
        let keys = [];
        var dstring = newString;
        for (i = 0; i < dstring.length; i++) {
          var sstr = dstring[i];
          keys.push(
            new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.POST_SEARCH,
              sstr
            )
          );
        }

        let exists = await client.batchExists(keys, batchPolicy);
        var batchRecords = [];

        exists.forEach(async (result) => {
          var pk_word = result.record.key.key; //primary key
          var shortKey = pk_word.slice(0, 2).toLowerCase();
          // var timestmp = new Date().getTime().toString()
          var pid = `${post_id}`; //post id to append
          var newKey = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_POSTS_SEARCH,
            pk_word
          );
          if (req.query.flwr_count > 0) {
            console.log("Celb is posting....");
            if (result.status !== 0) {
              //console.info('Key: %o does not exist', result.record.key.key);
              batchRecords.push({
                type: batchType.BATCH_WRITE,
                key: newKey,
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
                key: newKey,
                ops: [
                  //if exists, append
                  Aerospike.lists.append("celb_p_l", pid),
                  Aerospike.operations.incr("celb_c", 1),
                ],
              });
            }
          } else {
            console.log("Normal user posting");
            if (result.status !== 0) {
              //console.info('Key: %o does not exist', result.record.key.key);
              batchRecords.push({
                type: batchType.BATCH_WRITE,
                key: newKey,
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
                key: newKey,
                ops: [
                  //if exists, append
                  Aerospike.lists.append("u_p_l", pid),
                  Aerospike.operations.incr("u_c", 1),
                ],
              });
            }
          }
        });
        await client.batchWrite(batchRecords, batchPolicy);

        // Create the batch write policy
        let batchWritePolicy = new Aerospike.BatchWritePolicy({
          // An example that will always return true
          //filterExpression: exp.gt(exp.int(2), exp.int(1))
        });

        // **************************************************************** //

        try {
          console.log(oldString);
          console.log("Post");
          var getPostData = await client.get(post_key);
          return res.status(201).json(getPostData.bins);
        } catch (error) {
          return res.status(401).json({ msg: error.message });
        }
      }
    }
  }
  // Only image file
  else {
    console.log("Image");
    if (
      req.file.mimetype === "image/jpeg" ||
      req.file.mimetype === "image/png"
    ) {
      const newImageName = req.file.originalname;
      const blob = bucket.file(newImageName);
      const blobStream = blob.createWriteStream();
      blobStream.on("error", (err) => {
        console.log(err);
        return res.status(400).json({ msg: err.message });
      });
      blobStream.on("finish", async () => {
        // *** Main post bin
        const post_bins = {
          id: post_id.toString(),
          content: req.body.content,
          l_c: 0, // Like count
          d_c: 0, // Dislike count
          book: [], // Bookmark
          image: blob.name,
          pinned: 0,
          u_id: req.user.u_id.toString(), // User id
          u_fn: req.user.fn, // Post user first name
          u_ln: req.user.ln, // Posted user last name
          u_dun: req.user.handleUn, // Post user display username
          u_img: req.user.p_i, // Post user profile image
          hide: [], // hold userId those who hide this post
          s_c: 0, // spam count
          c_t: new Date().getTime().toString(), // Post time
          u_t: new Date().getTime().toString(), // Post update time
          c_c: 0, // Comment count related to the post
          s_c: 0, // Share count..
          is_share: 0,
          is_poll: false,
          cc: counterData.bins.cc,
          isMedia: true,
        };
        // *** Post meta bin
        const post_meta_bins = {
          id: post_id.toString(),
          likes: [],
          heart: [],
          haha: [],
          party: [],
          dislikes: [],
          spam: [],
          share: [],
        };
        const post_comment_bins = {
          pid: post_id,
        };
        await client.put(post_meta_key, post_meta_bins);
        await client.put(post_key, post_bins);
        await client.put(post_comment, post_comment_bins);

        const batchType = Aerospike.batchType;
        // Create a new batch policy
        let batchPolicy = new Aerospike.BatchPolicy({
          // An example that will always return true
          //filterExpression: exp.eq(exp.str(2), exp.int(1))
        });
        let keys = [];
        var dstring = newString;
        for (i = 0; i < dstring.length; i++) {
          var sstr = dstring[i];
          keys.push(
            new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.POST_SEARCH,
              sstr
            )
          );
        }

        let exists = await client.batchExists(keys, batchPolicy);
        var batchRecords = [];
        exists.forEach((result) => {
          var pk_word = result.record.key.key; //primary key
          var shortKey = pk_word.slice(0, 2).toLowerCase();
          var timestmp = new Date().getTime().toString();
          var pid = `${post_id}_${timestmp.slice(timestmp.length - 3)}`; //post id to append
          var newKey = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_POSTS_SEARCH,
            pk_word
          );
          if (req.query.flwr_count > 0) {
            if (result.status !== 0) {
              //console.info('Key: %o does not exist', result.record.key.key);
              batchRecords.push({
                type: batchType.BATCH_WRITE,
                key: newKey,
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
                key: newKey,
                ops: [
                  //if exists, append
                  Aerospike.lists.append("celb_p_l", pid),
                  Aerospike.operations.incr("celb_c", 1),
                ],
              });
            }
          } else {
            console.log("Normal user posting");
            if (result.status !== 0) {
              //console.info('Key: %o does not exist', result.record.key.key);
              batchRecords.push({
                type: batchType.BATCH_WRITE,
                key: newKey,
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
                key: newKey,
                ops: [
                  //if exists, append
                  Aerospike.lists.append("u_p_l", pid),
                  Aerospike.operations.incr("u_c", 1),
                ],
              });
            }
          }
        });

        await client.batchWrite(batchRecords, batchPolicy);
        // Create the batch write policy
        let batchWritePolicy = new Aerospike.BatchWritePolicy({
          // An example that will always return true
          //filterExpression: exp.gt(exp.int(2), exp.int(1))
        });
        try {
          var getPostData = await client.get(post_key);
          // console.log(getPostData)
          return res.status(201).json(getPostData.bins);
        } catch (error) {
          return res.status(401).json({ msg: error.message });
        }
      });
      blobStream.end(req.file.buffer);
    } else {
      console.log("Uploading video file...");
    }
  }
});

// Create poll
router.post("/poll", async (req, res) => {
  const client = await getAerospikeClient();
  // const post_id = `${new Date().getTime().toString()}-${req.user._id.toString().slice((req.user._id.toString().length - 6))}`;
  const post_id = now.micro();
  const post_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_POSTS,
    post_id
  );
  console.log(post_id);

  const poll_bins = {
    id: post_id,
    isPoll: true,
    pinned: 0,
    l_c: 0, // Like count
    d_c: 0, // Dislike count
    book: [], // Bookmark
    u_id: req.user._id.toString(),
    u_fn: req.user.firstName, // Post user first name
    u_ln: req.user.lastName, // Posted user last name
    u_dun: req.user.handleUn, // Post user display username
    u_img: req.user.p_i, // Post user profile image
    hide: [],
    c_t: new Date().getTime().toString(), // Post time
    u_t: new Date().getTime().toString(), // Post update time
    s_c: 0, // spam count
    c_c: 0, // Comment count related to the post
    share_c: 0, // Share count..
    is_share: 0,
    question: req.body.question,
    poll_opt1: req.body.opt1,
    poll_opt2: req.body.opt2,
    opt1_vote: [],
    opt2_vote: [],
    time: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getTime(),
    post_meta_bins: {
      id: post_id,
      // comment: []
    },
  };
  const post_meta_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_POSTS_META,
    post_id
  );
  const post_meta_bins = {
    likes: [],
    heart: [],
    haha: [],
    party: [],
    dislikes: [],
    spam: [],
    share: [],
  };
  await client.put(post_key, poll_bins);
  await client.put(post_meta_key, post_meta_bins);
  try {
    var getPostData = await client.get(post_key);
    // console.log(getPostData);
    return res.status(201).json(getPostData.bins);
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
});

// Voting for poll
router.post("/vote/poll/:id", async (req, res) => {
  const postId = req.params.id;
  const option = req.query.option;
  const client = await getAerospikeClient();

  if (!postId || !option) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      postId
    );
    const data = await client.get(post_key);
    if (data.bins.poll_opt1 === option) {
      const increment_poll1_vote = [
        Aerospike.lists.append("opt1_vote", req.user.handleUn),
      ];
      client.operate(post_key, increment_poll1_vote, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          const postData = await client.get(post_key);
          return res
            .status(200)
            .json({ msg: "Your vote has been submitted", post: postData.bins });
        }
      });
    } else {
      const increment_poll1_vote = [
        Aerospike.lists.append("opt2_vote", req.user.handleUn),
      ];
      client.operate(post_key, increment_poll1_vote, async (err, result) => {
        if (err) {
          return res.status(401).json({ msg: err.message });
        } else {
          const postData = await client.get(post_key);
          console.log(postData);
          return res
            .status(200)
            .json({ msg: "Your vote has been submitted", post: postData.bins });
        }
      });
    }
  }
});

// Pinned Post:
router.put("/pinned/:id", async (req, res) => {
  console.log("Came here with ", req.params.id);
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    // const post_meta_key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_POSTS_META, req.params.id);
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["pinned"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    // const queryPolicy = new Aerospike.QueryPolicy({});
    const stream = query.foreach();
    stream.on("data", async function (record) {
      if (record.bins.pinned > 0) {
        const ops = [Aerospike.operations.incr("pinned", -1)];
        await client.operate(post_key, ops);
      } else {
        const ops = [Aerospike.operations.incr("pinned", 1)];
        await client.operate(post_key, ops);
      }
    });

    stream.on("end", async function (posts) {
      var postData = await client.get(post_key);
      res.status(200).json(postData.bins);
    });
  }
});

// get posts related to user
router.get("/user/post/:handleUn", async (req, res) => {
  const handleUn = req.params.handleUn;
  const client = await getAerospikeClient();
  if (!handleUn) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);

    query.where(Aerospike.filter.equal("u_dun", handleUn));
    const queryPolicy = new Aerospike.QueryPolicy();

    // queryPolicy.filterExpression = exp.and(
    //   exp.ge(exp.binInt("cc"), exp.int(start)),
    //   exp.lt(exp.binInt("cc"), exp.int(end))
    // );
    var stream = query.foreach();
    var arr = [];
    var page = req.query.page;
    var newLimit = 5;
    const limit = page > 0 ? 6 * page : 6 * 1;
    // console.log("limit : "+limit)
    var start = limit - 1;

    var itemStart = (Number(page) - 1) * newLimit;
    var itemEnd = Number(page) * newLimit;

    stream.on("data", async (data) => {
      arr.push(data.bins);
      // arr.sort((a, b) => b.id - a.id).slice(0, 5)
      //console.log(data.bins);
      // if (data.bins.is_share) {
      //   console.log("share");
      //   if (data.bins.share_data.s_u_dun === handleUn) {
      //     arr.push(data.bins);
      //   }
      // } else {
      //   if (data.bins.u_dun === handleUn) {
      //     arr.push(data.bins);
      //   }
      // }
    });

    stream.on("end", function (posts) {
      console.log(page);
      if (page <= limit) {
        var temp = arr.sort((a, b) => b.id - a.id);
        var postsData = temp.slice(itemStart, itemEnd);
      }

      return res.status(200).json({ posts: postsData });
    });
  }
});

router.get("/user/post/media/:handleUn", async (req, res) => {
  const handleUn = req.params.handleUn;
  const client = await getAerospikeClient();
  if (!handleUn) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);

    query.where(Aerospike.filter.equal("u_dun", handleUn));
    const queryPolicy = new Aerospike.QueryPolicy();

    // queryPolicy.filterExpression = exp.and(
    //   exp.ge(exp.binInt("cc"), exp.int(start)),
    //   exp.lt(exp.binInt("cc"), exp.int(end))
    // );
    // isMedia
    var stream = query.foreach();
    var arr = [];
    var page = req.query.page;
    var newLimit = 5;
    const limit = page > 0 ? 6 * page : 6 * 1;
    // console.log("limit : "+limit)
    var start = limit - 1;

    var itemStart = (Number(page) - 1) * newLimit;
    var itemEnd = Number(page) * newLimit;

    stream.on("data", async (data) => {
      // arr.push(data.bins)
      // console.log(data.bins);
      if (data.bins.isMedia) {
        arr.push(data.bins);
      }
    });

    stream.on("end", function (posts) {
      return res.status(200).json(arr);
    });
  }
});

// Unpinned Post
router.put("/unpinned/:id", async (req, res) => {
  const postId = req.params.id;
  const client = await getAerospikeClient();
  if (!postId) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    // var post = await Post.updateMany({}, { pinned: false }, { multi: false });

    var post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      "social_posts",
      req.params.id.toString()
    );

    const ops = [Aerospike.operations.incr("pinned", -1)];

    client.operate(post_key, ops, async (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        var postData = await client.get(post_key);
        var post = await Post.findByIdAndUpdate(
          postId,
          { $set: { pinned: false } },
          { new: true }
        );
        try {
          return res.status(200).json({
            msg: "Successfully unpinned post",
            post: post,
            postData: postData,
          });
        } catch (err) {
          return res.status(501).json({ msg: err.message });
        }
      }
    });
  }
});

// DELETE POST
router.delete("/delete/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id.toString()
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id.toString()
    );

    client
      .exists(post_key)
      .then((data) => {
        if (data) {
          const ops = [Aerospike.operations.write("isDelete", true)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Post deleted" });
            }
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({ msg: err.message });
      });
  }
});

// Bookmark post
router.put("/bookmark/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["book"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    // const queryPolicy = new Aerospike.QueryPolicy({});
    const stream = query.foreach();
    stream.on("data", async function (record) {
      var bookmarkArr = record.bins.book;
      if (bookmarkArr.includes(req.user.handleUn)) {
        console.log("Bookmarked");
        const ops = [Aerospike.lists.removeByValue("book", req.user.handleUn)];
        await client.operate(post_key, ops);
      } else {
        console.log("Not Bookmarked");
        const ops = [Aerospike.lists.append("book", req.user.handleUn)];
        await client.operate(post_key, ops);
      }
    });
    stream.on("end", async function (posts) {
      var postData = await client.get(post_key);
      res.status(200).json(postData.bins);
    });
  }
});

// Post like...
router.put("/:id/like", async (req, res, next) => {
  const client = await getAerospikeClient();
  const maps = Aerospike.maps;
  var incrmentedBy = 0;
  var decrementedBy = 0;

  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid parameter" });
  } else {
    var data;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["heart", "dislikes", "haha", "party", "likes"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    // const queryPolicy = new Aerospike.QueryPolicy({});
    const stream = query.foreach();
    stream.on("data", async function (record) {
      var likesArr = record.bins.likes;
      var dislikesArr = record.bins.dislikes;

      // *** Likes
      if (record.bins.likes.includes(req.user.handleUn)) {
        console.log("Already like");
        const ops = [Aerospike.lists.removeByValue("likes", req.user.handleUn)];
        const data = await client.operate(post_meta_key, ops);
        if (req.query.likedBy !== "likes") {
          const ops = [
            Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
          ];
          const data = await client.operate(post_meta_key, ops);
        } else {
          decrementedBy--;
        }
      }
      // *** Dislikes
      else if (record.bins.heart.includes(req.user.handleUn)) {
        console.log("Already heart");
        const ops = [Aerospike.lists.removeByValue("heart", req.user.handleUn)];
        const data = await client.operate(post_meta_key, ops);
        if (req.query.likedBy !== "heart") {
          const ops = [
            Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
          ];
          const data = await client.operate(post_meta_key, ops);
        } else {
          decrementedBy--;
        }
      }
      // **** Haha
      else if (record.bins.haha.includes(req.user.handleUn)) {
        console.log("Already haha");
        const ops = [Aerospike.lists.removeByValue("haha", req.user.handleUn)];
        const data = await client.operate(post_meta_key, ops);
        if (req.query.likedBy !== "haha") {
          const ops = [
            Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
          ];
          const data = await client.operate(post_meta_key, ops);
        } else {
          decrementedBy--;
        }
      }
      // *** Party
      else if (record.bins.party.includes(req.user.handleUn)) {
        console.log("Already party");
        const ops = [Aerospike.lists.removeByValue("party", req.user.handleUn)];
        const data = await client.operate(post_meta_key, ops);
        if (req.query.likedBy !== "party") {
          const ops = [
            Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
          ];
          const data = await client.operate(post_meta_key, ops);
        } else {
          decrementedBy--;
        }
      }
      // *** Dislikes
      else if (record.bins.dislikes.includes(req.user.handleUn)) {
        console.log("Already dislikes");
        const ops = [Aerospike.lists.removeByValue("like", req.user.handleUn)];
        const data = await client.operate(post_meta_key, ops);
        if (req.query.likedBy !== "likes") {
          const ops = [
            Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
          ];
          const data = await client.operate(post_meta_key, ops);
        } else {
          decrementedBy--;
        }
      } else {
        incrmentedBy++;
        const ops = [
          Aerospike.lists.append(`${req.query.likedBy}`, req.user.handleUn),
        ];
        const data = await client.operate(post_meta_key, ops);
      }
    });

    stream.on("end", function (posts) {
      let query1 = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS
      );
      const tempBin1 = "ExpVar"; // this bin is to hold expression read operation output
      query1.select(["l_c"]); //select single bin
      query1.where(Aerospike.filter.equal("id", req.params.id));
      const stream1 = query1.foreach();
      // console.log("Stream end")
      stream1.on("data", async function (record) {
        // console.log("Operations: " + incrmentedBy);
        if (decrementedBy === 0) {
          const ops = [Aerospike.operations.incr("l_c", incrmentedBy)]; //
          client.operate(post_key, ops, async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              // var test = await client.get(post_key);
              // console.log(test.bins)
            }
          });
        } else {
          const ops = [Aerospike.operations.incr("l_c", decrementedBy)]; //
          client.operate(post_key, ops, async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              // var test = await client.get(post_key);
              // console.log(test.bins)
            }
          });
        }
      });

      stream1.on("end", async function (posts) {
        // console.log("stream1 end")
        var postData = await client.get(post_key);
        res.status(200).json(postData.bins);
      });
    });
  }
});

router.put("/:id/dislike", async (req, res) => {
  const client = await getAerospikeClient();
  const maps = Aerospike.maps;
  var incrmentedBy = 0;
  var decrementedBy = 0;

  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid parameter" });
  } else {
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["likes", "dislikes"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    const stream = query.foreach();
    stream.on("data", async function (record) {
      var likesArr = record.bins.likes;
      var dislikesArr = record.bins.dislikes;
      // if user already dislike this post then remove that dislike
      if (likesArr.includes(req.user.handleUn)) {
        const ops = [
          Aerospike.lists.removeByValue("likes", req.user.handleUn),
          Aerospike.lists.append("dislikes", req.user.handleUn),
        ];
        decrementedBy--;
        incrmentedBy++;
        data = await client.operate(post_meta_key, ops);
      } else {
        // if user already likes this post then remove that like
        if (dislikesArr.includes(req.user.handleUn)) {
          incrmentedBy--;
          const ops = [
            Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
          ];
          data = await client.operate(post_meta_key, ops);
        } else {
          incrmentedBy++;
          const ops = [Aerospike.lists.append("dislikes", req.user.handleUn)];
          data = await client.operate(post_meta_key, ops);
        }
      }
    });
    stream.on("end", function (posts) {
      let query1 = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_POSTS
      );
      const tempBin1 = "ExpVar"; // this bin is to hold expression read operation output
      query1.select(["l_c", "d_c"]); //select single bin
      query1.where(Aerospike.filter.equal("id", req.params.id));
      const stream1 = query1.foreach();
      // console.log("Stream end")
      stream1.on("data", async function (record) {
        // console.log("Operations: " + incrmentedBy);
        const ops = [
          Aerospike.operations.incr("d_c", incrmentedBy),
          Aerospike.operations.incr("l_c", decrementedBy),
        ]; //
        client.operate(post_key, ops, async (err, data) => {
          if (err) {
            console.log(err);
          } else {
            var test = await client.get(post_key);
            // console.log(test.bins)
          }
        });
      });

      stream1.on("end", async function (posts) {
        // console.log("stream1 end")
        var postData = await client.get(post_key);
        res.status(200).json(postData.bins);
      });
    });
  }
});

router.put("/spam/:id", async (req, res) => {
  console.log(req.params.id);
  const client = await getAerospikeClient();
  var incrmentedBy = 0;

  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    // let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS_META);
    // const tempBin = 'ExpVar'; // this bin is to hold expression read operation output
    // // query.select(["spam"]); //select single bin
    // query.where(Aerospike.filter.equal("id", req.params.id));
    // var analytics_key = `${new Date().getDate()}-${new Date().getMonth() + 1
    //   }-${new Date().getFullYear()}`;

    // const stream = query.foreach();
    // stream.on("data", async function (record) {
    //   var spam = record.bins.spam;
    //   if (spam.includes(req.user.handleUn)) {
    //     console.log("already spam")
    //     incrmentedBy--;
    //     const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
    //     await client.operate(post_meta_key, ops);
    //   } else {
    //     incrmentedBy++;
    //     const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
    //     await client.operate(post_meta_key, ops);
    //   }
    // })
    // stream.on("end", async function (data) {
    //   let query1 = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
    //   const tempBin1 = 'ExpVar'; // this bin is to hold expression read operation output
    //   query1.select(["s_c"]); //select single bin
    //   query1.where(Aerospike.filter.equal("id", req.params.id));
    //   const stream1 = query1.foreach();

    //   stream1.on('data', async function (record) {
    //     // console.log("Operations: " + incrmentedBy);
    //     const ops = [Aerospike.operations.incr("s_c", incrmentedBy)]; //
    //     client.operate(post_key, ops, async (err, data) => {
    //       if (err) {
    //         console.log(err)
    //       } else {
    //         // var test = await client.get(post_key);
    //         // console.log(test.bins)
    //       }
    //     })
    //   });

    //   stream1.on('end', async function (posts) {
    //     console.log("stream1 end")
    //     var postData = await client.get(post_key);
    //     const obj = {
    //       "spam": postData.bins.s_c
    //     };
    //     await client.operate(post_meta_key, [
    //       Aerospike.maps.put("analytics", analytics_key, obj)
    //     ]);
    //     // return res.status(200).json(postData.bins);

    //     // // **** ADD **** //
    //     // const maps = Aerospike.maps;
    //     // const map = new Aerospike.cdt.Map([
    //     //   { key: "spam", value: postData.bins.s_c }
    //     // ])
    //     // const ops = [Aerospike.operations.put(map)]
    //     // await client.operate(post_meta_key, ops);
    //     return res.status(200).json(postData.bins);
    //   });
    // })

    const postMetaData = await client.get(post_meta_key);
    console.log(postMetaData.bins);
    if (postMetaData.bins.spam.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("sp_c", -1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const data = await client.get(post_key);
              if (data.bins.sp_c >= process.env.MINIMUM_SPAM_COUNT) {
                const ops = [Aerospike.operations.write("isDisable", true)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "You remove spammed from this post" });
                  }
                });
              } else {
                const ops = [Aerospike.operations.write("isDisable", false)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "You remove spammed from this post" });
                  }
                });
              }
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("sp_c", 1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const data = await client.get(post_key);
              if (data.bins.sp_c >= process.env.MINIMUM_SPAM_COUNT) {
                const ops = [Aerospike.operations.write("isDisable", true)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "You spammed this post" });
                  }
                });
              } else {
                const ops = [Aerospike.operations.write("isDisable", false)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "You spammed this post" });
                  }
                });
              }
            }
          });
        }
      });
    }
  }
});

router.put("/emoji_like/:id", async (req, res) => {
  const maps = Aerospike.maps;
  var emoji_str;
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request parameter" });
  } else {
    const client = await getAerospikeClient();
    var post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(401).json({ msg: "no post found" });
    } else {
      for (const [key, value] of Object.entries(post.reactions)) {
        var str = `reactions.${key}`;
        post = await Post.findByIdAndUpdate(
          req.params.id,
          { $pull: { [str]: req.user._id } },
          { new: true }
        );
      }

      // Remove all previous likes
      let post_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        "social_posts",
        req.params.id.toString()
      );
      let remove_reaction_ops = [
        Aerospike.lists.removeByValue("l_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("e_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("p_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("w_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("a_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("c_c", req.user._id.toString()),
        Aerospike.lists.removeByValue("an_c", req.user._id.toString()),
      ];
      client.operate(post_key, remove_reaction_ops, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
      const postData = await client.get(post_key);

      if (postData.bins.meta_count.like !== 0) {
        let meta_ops = [maps.decrement("meta_count", "like", 1)];
        client.operate(post_key, meta_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            // console.log(result);
          }
        });
      }
      // *** Insert new emoji like...

      if (req.query.type === "emoji") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("e_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else if (req.query.type == "party") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("p_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else if (req.query.type === "wow") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("w_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else if (req.query.type === "angel") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("a_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else if (req.query.type === "crying") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("c_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else if (req.query.type === "angry") {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("an_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      } else {
        console.log(req.query.type);
        var reaction_ops = [
          Aerospike.lists.append("l_c", req.user._id.toString()),
        ];
        client.operate(post_key, reaction_ops, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result);
          }
        });
      }

      let meta_ops_increment = [maps.increment("meta_count", "like", 1)];
      client.operate(post_key, meta_ops_increment, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(result);
        }
      });

      var queryStr = `reactions.${req.query.type}`;
      post = await Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { [queryStr]: req.user._id } },
        { new: true }
      );
      try {
        return res.status(200).json(post);
      } catch (error) {
        return res.status(501).json({ msg: error.message });
      }
    }
  }
});

router.post("/repost/status/:id", async (req, res) => {
  const post_id = now.micro();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      post_id.toString()
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      post_id.toString()
    );
    const original_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    const original_post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );

    client
      .exists(original_post_key)
      .then(async (data) => {
        const postData = await client.get(original_post_key);
        console.log(postData.bins);
        const bins = {
          id: post_id,
          o_p_id: postData.bins.id,
          content: postData.bins.content,
          image: postData.bins.image || "",
          gif: postData.bins.gif || "",
          l_c: 0,
          d_c: 0,
          book: [],
          pinned: 0,
          u_id: postData.bins.u_id,
          u_fn: postData.bins.u_fn,
          u_ln: postData.bins.u_ln,
          u_dun: postData.bins.u_dun,
          u_img: postData.bins.u_img,
          hide: [],
          s_c: 0,
          c_t: postData.bins.c_t,
          u_t: postData.bins.u_t,
          postOf: postData.bins.postOf,
          c_c: 0,
          is_share: 1,
          is_poll: false,
          share: {
            u_id: req.user.u_id.toString(), // User id
            u_fn: req.user.fn, // Post user first name
            u_ln: req.user.ln, // Posted user last name
            u_dun: req.user.handleUn, // Post user display username
            u_img: req.user.p_i, // Post user profile image
            content: req.body.content,
          },
        };
        const post_meta_bins = {
          id: post_id,
          likes: [],
          dislikes: [],
          spam: [],
          share: [],
        };
        await client.put(post_meta_key, post_meta_bins);
        // console.log(post_bins);
        await client.put(post_key, bins);
        const user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USER_META,
          req.user.handleUn
        );
        const user_ops = [
          Aerospike.lists.append(process.env.SET_POSTS, post_id),
        ];
        client.operate(user_key, user_ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            try {
              const ops = [Aerospike.operations.incr("share_c", 1)];
              client.operate(original_post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // ***** ADD ***** //
                  const ops = [Aerospike.lists.append("share", post_id)];
                  let result = await client.operate(
                    original_post_meta_key,
                    ops
                  );
                  return res
                    .status(200)
                    .json({ msg: "Successfully share this post" });
                }
              });
            } catch (error) {
              return res.status(400).json({ msg: error.message });
            }
          }
        });
      })
      .catch((err) => {
        return res.status(401).json({ msg: err.message });
      });
  }
});

router.put("/hide/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    var arr;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    var analytics_key = `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`;

    console.log(analytics_key);

    let query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["hide"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    // const queryPolicy = new Aerospike.QueryPolicy({});
    const stream = query.foreach();
    stream.on("data", function (record) {
      arr = record.bins.hide;
    });
    stream.on("end", function (posts) {
      if (arr.includes(req.user.handleUn)) {
        const ops = [Aerospike.lists.removeByValue("hide", req.user.handleUn)];
        client
          .operate(post_key, ops)
          .then(async (data) => {
            return res.status(200).json(data);
          })
          .catch((err) => {
            return res.status(401).json({ msg: err.message });
          });
      } else {
        const ops = [Aerospike.lists.append("hide", req.user.handleUn)];
        client
          .operate(post_key, ops)
          .then(async (data) => {
            return res.status(200).json(data);
          })
          .catch((err) => {
            return res.status(401).json({ msg: err.message });
          });
      }
    });
  }
});

// Fetch all medias
router.get("/profile/media/:handleUn", async (req, res) => {
  if (!req.params.handleUn) {
    return res.status(401).json({ msg: "Invalid request parameter" });
  } else {
    var user = await User.findOne({ handleUn: req.params.handleUn });
    // console.log(user._id);
    var medias = await User_Media.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    try {
      return res.status(200).json(medias);
    } catch (error) {
      return res.status(501).json({ msg: "Could not fetch" });
    }
  }
});

router.get("/search/post", async (req, res) => {
  const exp = Aerospike.exp;
  const client = await getAerospikeClient();
  let query = client.query(
    process.env.CLUSTER_NAME,
    process.env.SET_POSTS_SEARCH
  );
  const tempBin = "ExpVar"; // this bin is to hold expression read operation output
  const input_query = req.query.search;
  const search_query = req.query.search.slice(0, 2);

  query.where(Aerospike.filter.equal("f_t", search_query));

  const queryPolicy = new Aerospike.QueryPolicy({});

  queryPolicy.filterExpression = exp.cmpRegex(
    Aerospike.regex.ICASE | Aerospike.regex.NEWLINE,
    "^" + input_query,
    exp.binStr("p_k")
  );

  var arr = [];
  var posts = [];
  var obj = {};
  var temp = 0;
  var bbins = [];
  const stream = query.foreach(queryPolicy);
  stream.on("data", function (record) {
    // console.log("*** Post Search List ***");
    if (record.bins.u_p_l && record.bins.u_p_l.length > 0) {
      bbins.push(record.bins.u_p_l);
    } else if (record.bins.celb_p_l && record.bins.celb_p_l.length > 0) {
      bbins.push(record.bins.celb_p_l);
    }
    temp = bbins.flat();
  });

  stream.on("end", async function (posts) {
    for (let i = 0; i < temp.length; i++) {
      arr.push({
        key: new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_POSTS,
          temp[i]
        ),
        readAllBins: true,
      });
    }
    client.batchRead(arr, async (err, results) => {
      console.log(results);
      var arr = [];
      results.map((data) => {
        if (data.record.bins) {
          arr.push(data.record.bins);
        }
      });
      return res.status(200).json({ posts: arr });
    });
  });
});

// *** Find all users who liked this post
router.get("/like/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(400).json({ msg: err.message });
  } else {
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    query.select(["likes", "dislikes"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    // const queryPolicy = new Aerospike.QueryPolicy({});
    const stream = query.foreach();
    stream.on("data", async function (record) {
      // console.log("Operations: " + incrmentedBy);
      console.log(record);
    });

    stream.on("end", async function (posts) {
      // console.log("stream1 end")
    });
  }
});

// Fetch all trending key words
router.get("/trending/list", async (req, res) => {
  // console.log("HI")
  var arr = [];
  const client = await getAerospikeClient();
  let query = client.query(process.env.CLUSTER_NAME, process.env.SET_TRENDING);
  const stream = query.foreach();

  stream.on("data", function (record) {
    // console.log(record.bins)
    arr.push(record.bins);
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
        return res.status(200).json({ isSearch: true, search_lists });
      });
    } else {
      var temp = arr.sort((a, b) => b.p_c - a.p_c);
      return res.status(200).json({ isSearch: false, temp });
    }
  });
});

// fetch all trending posts
router.get("/trending/posts", async (req, res) => {
  const client = await getAerospikeClient();
  const term = `#${req.query.key}`;

  let query = client.query(process.env.CLUSTER_NAME, process.env.SET_TRENDING);
  const tempBin = "ExpVar"; // this bin is to hold expression read operation output
  query.select(["p_l"]); //select single bin
  query.where(Aerospike.filter.equal("p_k", term));
  const stream = query.foreach();
  var arr = [];
  var temp = [];
  var posts = [];

  stream.on("data", function (record) {
    // console.log(record.bins.p_l);
    arr = record.bins.p_l;
    for (let i = 0; i < arr.length; i++) {
      temp.push({
        key: new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_POSTS,
          arr[i]
        ),
        readAllBins: true,
      });
    }
  });

  stream.on("end", async function (record) {
    // temp = temp.slice(0, 10);
    // var page = req.query.page;
    // var limit = 3;
    // var start = (page - 1) * limit;
    // var end = page * limit;
    // var res = temp.slice(0, 3);
    // // console.log(temp)

    // // for (let i = 0; i < temp.length; i++) {
    // //   var data = await client.get(temp[i].key);
    // //   console.log("***********")
    // //   console.log(data.bins);
    // //   posts.push(data.bins);
    // // }
    // // temp.slice(start, end)
    // // return res.status(400).json(posts);

    client.batchRead(temp, async (err, results) => {
      posts = results;
      return res.status(200).json(posts);
    });
  });
});

// fetch all user who liked post
router.get("/like/users/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // query.select("likes", "heart", "haha", "party", "dislike"); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var arr = [];
    var temp = [];
    var users = [];

    stream.on("data", function (record) {
      if (req.query.type === "all") {
        arr = [
          ...record.bins.likes,
          ...record.bins.haha,
          ...record.bins.angry,
          ...record.bins.dislikes,
        ];
      }
      // Only likes
      else if (req.query.type === "likes") {
        arr = record.bins.likes;
        console.log("Likes ", arr);
      }
      // Only heart
      if (req.query.type === "heart") {
        arr = record.bins.heart;
        console.log("Heart ", arr);
      }
      // Only party
      else if (req.query.type === "angry") {
        arr = record.bins.angry;
      }
      // only haha
      else if (req.query.type === "haha") {
        arr = record.bins.haha;
      }
      // only dislikes
      else if (req.query.type === "dislikes") {
        arr = record.bins.dislikes;
      }

      for (let i = 0; i < arr.length; i++) {
        temp.push({
          key: new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_USERS,
            arr[i]
          ),
          type: batchType.BATCH_READ,
          readAllBins: false,
          bins: ["handleUn", "fn", "ln", "p_i"],
        });
      }
    });

    stream.on("end", async function (record) {
      client.batchRead(temp, async (err, results) => {
        users = results;
        var page = req.query.page || 1;
        var limit = 5;
        var start = (page - 1) * limit;
        var end = page * limit;

        users = users.splice(start, end);
        return res.status(200).json(users);
      });
    });
  }
});

// **** Fetch news
router.get("/fetch/news", async (req, res) => {
  const client = await getAerospikeClient();
  var arr = [];
  let query = client.query(process.env.CLUSTER_NAME, process.env.SET_NEWS);
  const tempBin1 = "ExpVar";
  // query.where(Aerospike.filter.equal("handleUn", req.user.handleUn));
  const stream = query.foreach();
  stream.on("data", function (record) {
    arr.push(record.bins);
  });

  stream.on("end", function (record) {
    return res.status(200).json(arr);
  });
});

// ******** TESTING POST CREATE API ************* //
router.post("/create", multer.single("image"), async (req, res) => {
  console.log(req.user);
  if (req.body.content) {
    var arr = req.body.content.split(" ");
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].includes("https://" || "http://" || "www.")) {
        var url = arr[i];
        arr.splice(i, 1);
      }
    }
    req.body.content = arr.join(" ");
  }
  const post_id = now.micro();
  var metions = "";
  const postArr = req.body.content.split(" ");
  for (let i = 0; i < postArr.length; i++) {
    if (postArr[i].includes("@")) {
      metions = postArr[i].replace("@", "").replace("[", "").replace("]", "");
    }
  }

  // Then post does not have an image file
  if (!req.file) {
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const oldString = req.body.content
      .trim()
      .replace(/(\r\n|\n|\r|(  ))/gm, " ")
      .split(" ");
    const newString = removeStopwords(oldString, eng);
    const post_content = req.body.content ? req.body.content : "";
    const post_gif = req.body.gif ? req.body.gif : "";

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
    // *** Poct comment table
    const post_comment = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      post_id.toString()
    );
    const user_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USER_META,
      req.user.handleUn
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
    for (i = 0; i < dstring.length; i++) {
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
      // *** Feed post
      if (batchArrKeys[i].set === process.env.SET_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("content", post_content), // Post content
            Aerospike.operations.write("gif", post_gif || ""), // post gif
            Aerospike.operations.write("l_c", 0),
            Aerospike.operations.write("pinned", 0), // Post pinned
            Aerospike.operations.write("book", []), // post bookmark
            Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
            Aerospike.operations.write("u_fn", req.user.fn), // User firstname
            Aerospike.operations.write("u_ln", req.user.ln), // user lastname
            Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
            Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
            Aerospike.operations.write("hide", []), // Hide
            Aerospike.operations.write("sp_c", 0), // post spam count
            Aerospike.operations.write("c_t", new Date().getTime()), //current post time
            Aerospike.operations.write("u_t", new Date().getTime()), // post updated time
            Aerospike.operations.write("c_c", 0), // post comment count
            Aerospike.operations.write("share_c", 0), // post share count
            Aerospike.operations.write("postOf", req.body.postOf),
            Aerospike.operations.write("privacy", req.body.privacy), // Post privacy
            Aerospike.operations.write("isPaid", req.body.isPaid), // Is this a paid post or not default is FALSE
            Aerospike.operations.write("cName", req.body.cName), // Promotion company name
            Aerospike.operations.write("country", req.body.country),
            Aerospike.operations.write("country", req.body.city),
            Aerospike.operations.write("blockId", req.body.blockId),
            Aerospike.operations.write("feeling", req.body.feeling),
            Aerospike.operations.write("feelingIcon", req.body.feelingIcon),
            Aerospike.operations.write("pop", []),
            Aerospike.operations.write("ran", []),
            Aerospike.operations.write("statusText", req.body.statusText),
            Aerospike.operations.write("userLocation", req.body.userLocation),
          ],
        });
      }
      // *** Main post
      else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
        batchRecords.push({
          type: batchType.BATCH_WRITE,
          key: batchArrKeys[i],
          ops: [
            Aerospike.operations.write("id", post_id), // user post list
            Aerospike.operations.write("content", post_content), // Post content
            Aerospike.operations.write("gif", post_gif || ""), // post gif
            Aerospike.operations.write("l_c", 0), // post like count
            Aerospike.operations.write("pinned", 0), // Post pinned
            Aerospike.operations.write("book", []), // post bookmark
            Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
            Aerospike.operations.write("u_fn", req.user.fn), // User firstname
            Aerospike.operations.write("u_ln", req.user.ln), // user lastname
            Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
            Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
            Aerospike.operations.write("hide", []), // Hide
            Aerospike.operations.write("sp_c", 0), // post spam count
            Aerospike.operations.write("c_t", new Date().getTime()), //current post time
            Aerospike.operations.write("u_t", new Date().getTime()), // post updated time
            Aerospike.operations.write("c_c", 0), // post comment count
            Aerospike.operations.write("s_c", 0), // post share count
            // Aerospike.operations.write("is_poll", false), //
            Aerospike.operations.write("postOf", req.body.postOf),
            // Aerospike.operations.write("privacy", req.query.priority)
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
              if (req.query.flwr_count > 0) {
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
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        req.user.handleUn
      );
      const user_ops = [Aerospike.operations.incr("post_c", 1)];
      const user_postCount = await client.operate(user_key, user_ops);
      try {
        if (!metions.trim()) {
          var getPostData = await client.get(post_key);
          return res.status(201).json(getPostData.bins);
        } else {
          const key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_USER_META,
            metions
          );
          const ops = [Aerospike.lists.append("metions", post_id)];
          client.operate(key, ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              var getPostData = await client.get(post_key);
              return res.status(201).json(getPostData.bins);
            }
          });
        }
        // const key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_USER_META, metions);
        // const ops = [Aerospike.lists.append("metions", post_id)];
        // client.operate(key, ops, (err, result) => {
        //   if (err) {
        //     return res.status(400).json({ msg: err.message });
        //   } else {
        //     return res.status(201).json(getPostData.bins);
        //   }
        // })
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  } else {
    console.log(req.file);
    if (req.file.mimetype.includes("image")) {
      const newImageName = post_id + "-" + req.file.originalname;
      console.log("New image name: ", newImageName);
      const blob = bucket.file(newImageName);
      console.log("Blob name: ", blob.name);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
        return res.status(400).json({ msg: err.message });
      });

      blobStream.on("finish", async () => {
        // var publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        var publicURL = blob.name;
        console.log(publicURL);
        const batchType = Aerospike.batchType;
        // const post_id = now.micro();
        const client = await getAerospikeClient();

        const post_content = req.body.content ? req.body.content : "";
        const post_gif = req.body.gif ? req.body.gif : "";

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
        // *** Poct comment table
        const post_comment = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_POST_COMMENT,
          post_id.toString()
        );
        const user_meta_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USER_META,
          req.user.handleUn
        );

        let batchPolicy1 = new Aerospike.BatchPolicy({});

        // **** Here we generate keys for TRENDING post
        let trending_key = [];
        var batchArrKeys = [];

        if (req.body.content) {
          const oldString = req.body.content
            .trim()
            .replace(/(\r\n|\n|\r|(  ))/gm, " ")
            .split(" ");
          const newString = removeStopwords(oldString, eng);
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
          for (i = 0; i < dstring.length; i++) {
            var sstr = dstring[i].toLowerCase();
            keys.push(
              new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.POST_SEARCH,
                sstr
              )
            );
          }
        }

        // *** Inserting all the keys inside batch array
        batchArrKeys = req.body.content
          ? [
              post_key,
              main_post_key,
              post_meta_key,
              user_meta_key,
              trending_key,
              keys,
              post_comment,
            ]
          : [
              post_key,
              main_post_key,
              post_meta_key,
              user_meta_key,
              post_comment,
            ];

        var batchRecords = [];
        for (let i = 0; i < batchArrKeys.length; i++) {
          // *** Feed post
          if (batchArrKeys[i].set === process.env.SET_POSTS) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.operations.write("id", post_id), // user post list
                Aerospike.operations.write("content", post_content || ""), // Post content
                Aerospike.operations.write("gif", post_gif), // post gif
                Aerospike.operations.write("l_c", 0),
                Aerospike.operations.write("pinned", 0), // Post pinned
                Aerospike.operations.write("book", []), // post bookmark
                Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
                Aerospike.operations.write("u_fn", req.user.fn), // User firstname
                Aerospike.operations.write("u_ln", req.user.ln), // user lastname
                Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
                Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
                Aerospike.operations.write("hide", []), // Hide
                Aerospike.operations.write("sp_c", 0), // post spam count
                Aerospike.operations.write("c_t", new Date().getTime()), //current post time
                Aerospike.operations.write("u_t", new Date().getTime()), // post updated time
                Aerospike.operations.write("c_c", 0), // post comment count
                Aerospike.operations.write("s_c", 0), // post share count
                Aerospike.operations.write("postOf", req.body.postOf),
                Aerospike.operations.write("privacy", req.body.privacy), // Post privacy
                Aerospike.operations.write("isPaid", req.body.isPaid), // Is this a paid post or not default is FALSE
                Aerospike.operations.write("cName", req.body.cName), // Promotion company name
                Aerospike.operations.write("country", req.body.country),
                Aerospike.operations.write("country", req.body.city),
                Aerospike.operations.write("blockId", req.body.blockId),
                Aerospike.operations.write("feeling", req.body.feeling),
                Aerospike.operations.write("feelingIcon", req.body.feelingIcon),
                Aerospike.operations.write("image", publicURL),

                Aerospike.operations.write("pop", []),
                Aerospike.operations.write("ran", []),
                Aerospike.operations.write("statusText", req.body.statusText),
                Aerospike.operations.write(
                  "userLocation",
                  req.body.userLocation
                ),
              ],
            });
          }
          // *** Main post
          else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.operations.write("id", post_id), // user post list
                Aerospike.operations.write("content", post_content), // Post content
                Aerospike.operations.write("gif", post_gif), // post gif
                Aerospike.operations.write("l_c", 0), // post like count
                Aerospike.operations.write("pinned", 0), // Post pinned
                Aerospike.operations.write("book", []), // post bookmark
                Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
                Aerospike.operations.write("u_fn", req.user.fn), // User firstname
                Aerospike.operations.write("u_ln", req.user.ln), // user lastname
                Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
                Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
                Aerospike.operations.write("hide", []), // Hide
                Aerospike.operations.write("sp_c", 0), // post spam count
                Aerospike.operations.write(
                  "c_t",
                  new Date().getTime().toString()
                ), //current post time
                Aerospike.operations.write(
                  "u_t",
                  new Date().getTime().toString()
                ), // post updated time
                Aerospike.operations.write("c_c", 0), // post comment count
                Aerospike.operations.write("s_c", 0), // post share count
                // Aerospike.operations.write("is_poll", false), //
                Aerospike.operations.write("postOf", req.body.postOf),
                Aerospike.operations.write("image", publicURL),
                // Aerospike.operations.write("privacy", req.query.priority)
                Aerospike.operations.write("statusText", req.body.statusText),
                Aerospike.operations.write(
                  "userLocation",
                  req.body.userLocation
                ),
              ],
            });
          }
          // *** Save post ID inside user meta table
          else if (batchArrKeys[i].set === process.env.SET_USER_META) {
            console.log(batchArrKeys[i]);
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.lists.append("posts", post_id), // user post list
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
                Aerospike.operations.write("angry", []), // Post haha
                Aerospike.operations.write("spam", []), // post spam
                Aerospike.operations.write("share", []), //post share
              ],
            });
          } else if (Array.isArray(batchArrKeys[i])) {
            if (batchArrKeys[i].length > 0) {
              // *** Trending
              if (batchArrKeys[i][0].set === process.env.SET_TRENDING) {
                let batchPolicy = new Aerospike.BatchPolicy({});
                let exists = await client.batchExists(
                  batchArrKeys[i],
                  batchPolicy
                );
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
                let exists = await client.batchExists(
                  batchArrKeys[i],
                  batchPolicy
                );
                exists.forEach(async (result) => {
                  var pk_word = result.record.key.key; //primary key
                  var shortKey = pk_word.slice(0, 2).toLowerCase();
                  // var timestmp = new Date().getTime().toString()
                  var pid = `${post_id}`; //post id to append
                  if (req.query.flwr_count > 0) {
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
          const user_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_USERS,
            req.user.handleUn
          );
          const user_ops = [Aerospike.operations.incr("post_c", 1)];
          const user_postCount = await client.operate(user_key, user_ops);
          try {
            if (!metions.trim()) {
              var getPostData = await client.get(post_key);
              return res.status(201).json(getPostData.bins);
            } else {
              const key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_USER_META,
                metions
              );
              const ops = [Aerospike.lists.append("metions", post_id)];
              client.operate(key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  var getPostData = await client.get(post_key);
                  return res.status(201).json(getPostData.bins);
                }
              });
            }
          } catch (err) {
            return res.status(400).json({ msg: err.message });
          }
        } catch (err) {
          return res.status(400).json({ msg: err.message });
        }
      });

      blobStream.end(req.file.buffer);
    } else {
      const newImageName = post_id + "-" + req.file.originalname;
      const blob = bucket.file(newImageName);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
        return res.status(400).json({ msg: err.message });
      });

      blobStream.on("finish", async () => {
        var publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        console.log(publicURL);
        const batchType = Aerospike.batchType;
        // const post_id = now.micro();
        const client = await getAerospikeClient();

        const post_content = req.body.content ? req.body.content : "";
        const post_gif = req.body.gif ? req.body.gif : "";

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
        // *** Poct comment table
        const post_comment = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_POST_COMMENT,
          post_id.toString()
        );
        const user_meta_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USER_META,
          req.user.handleUn
        );

        let batchPolicy1 = new Aerospike.BatchPolicy({});

        // **** Here we generate keys for TRENDING post
        let trending_key = [];
        var batchArrKeys = [];

        if (req.body.content) {
          const oldString = req.body.content
            .trim()
            .replace(/(\r\n|\n|\r|(  ))/gm, " ")
            .split(" ");
          const newString = removeStopwords(oldString, eng);
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
          for (i = 0; i < dstring.length; i++) {
            var sstr = dstring[i].toLowerCase();
            keys.push(
              new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.POST_SEARCH,
                sstr
              )
            );
          }
        }

        // *** Inserting all the keys inside batch array
        batchArrKeys = req.body.content
          ? [
              post_key,
              main_post_key,
              post_meta_key,
              user_meta_key,
              trending_key,
              keys,
              post_comment,
            ]
          : [
              post_key,
              main_post_key,
              post_meta_key,
              user_meta_key,
              post_comment,
            ];

        var batchRecords = [];
        for (let i = 0; i < batchArrKeys.length; i++) {
          // *** Feed post
          if (batchArrKeys[i].set === process.env.SET_POSTS) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.operations.write("id", post_id), // user post list
                Aerospike.operations.write("content", post_content || ""), // Post content
                Aerospike.operations.write("gif", post_gif), // post gif
                Aerospike.operations.write("l_c", 0),
                Aerospike.operations.write("pinned", 0), // Post pinned
                Aerospike.operations.write("book", []), // post bookmark
                Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
                Aerospike.operations.write("u_fn", req.user.fn), // User firstname
                Aerospike.operations.write("u_ln", req.user.ln), // user lastname
                Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
                Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
                Aerospike.operations.write("hide", []), // Hide
                Aerospike.operations.write("sp_c", 0), // post spam count
                Aerospike.operations.write("c_t", new Date().getTime()), //current post time
                Aerospike.operations.write("u_t", new Date().getTime()), // post updated time
                Aerospike.operations.write("c_c", 0), // post comment count
                Aerospike.operations.write("s_c", 0), // post share count
                Aerospike.operations.write("postOf", req.body.postOf),
                Aerospike.operations.write("privacy", req.body.privacy), // Post privacy
                Aerospike.operations.write("isPaid", req.body.isPaid), // Is this a paid post or not default is FALSE
                Aerospike.operations.write("cName", req.body.cName), // Promotion company name
                Aerospike.operations.write("country", req.body.country),
                Aerospike.operations.write("country", req.body.city),
                Aerospike.operations.write("blockId", req.body.blockId),
                Aerospike.operations.write("feeling", req.body.feeling),
                Aerospike.operations.write("feelingIcon", req.body.feelingIcon),
                Aerospike.operations.write("video", publicURL),
              ],
            });
          }
          // *** Main post
          else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.operations.write("id", post_id), // user post list
                Aerospike.operations.write("content", post_content), // Post content
                Aerospike.operations.write("gif", post_gif), // post gif
                Aerospike.operations.write("l_c", 0), // post like count
                Aerospike.operations.write("pinned", 0), // Post pinned
                Aerospike.operations.write("book", []), // post bookmark
                Aerospike.operations.write("u_id", req.user.u_id.toString()), // User ID,
                Aerospike.operations.write("u_fn", req.user.fn), // User firstname
                Aerospike.operations.write("u_ln", req.user.ln), // user lastname
                Aerospike.operations.write("u_dun", req.user.handleUn), // user handle username
                Aerospike.operations.write("u_img", req.user.p_i), // user profile pic
                Aerospike.operations.write("hide", []), // Hide
                Aerospike.operations.write("sp_c", 0), // post spam count
                Aerospike.operations.write(
                  "c_t",
                  new Date().getTime().toString()
                ), //current post time
                Aerospike.operations.write(
                  "u_t",
                  new Date().getTime().toString()
                ), // post updated time
                Aerospike.operations.write("c_c", 0), // post comment count
                Aerospike.operations.write("s_c", 0), // post share count
                // Aerospike.operations.write("is_poll", false), //
                Aerospike.operations.write("postOf", req.body.postOf),
                Aerospike.operations.write("video", publicURL),
                // Aerospike.operations.write("privacy", req.query.priority)
              ],
            });
          }
          // *** Save post ID inside user meta table
          else if (batchArrKeys[i].set === process.env.SET_USER_META) {
            console.log(batchArrKeys[i]);
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.lists.append("posts", post_id), // user post list
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
                Aerospike.operations.write("heart", []), // Post heart
                Aerospike.operations.write("haha", []), // Post haha
                Aerospike.operations.write("party", []), // Post party
                Aerospike.operations.write("dislikes", []), // post dislikes
                Aerospike.operations.write("spam", []), // post spam
                Aerospike.operations.write("share", []), //post share
              ],
            });
          } else if (Array.isArray(batchArrKeys[i])) {
            if (batchArrKeys[i].length > 0) {
              // *** Trending
              if (batchArrKeys[i][0].set === process.env.SET_TRENDING) {
                let batchPolicy = new Aerospike.BatchPolicy({});
                let exists = await client.batchExists(
                  batchArrKeys[i],
                  batchPolicy
                );
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
                let exists = await client.batchExists(
                  batchArrKeys[i],
                  batchPolicy
                );
                exists.forEach(async (result) => {
                  var pk_word = result.record.key.key; //primary key
                  var shortKey = pk_word.slice(0, 2).toLowerCase();
                  // var timestmp = new Date().getTime().toString()
                  var pid = `${post_id}`; //post id to append
                  if (req.query.flwr_count > 0) {
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
          const user_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_USERS,
            req.user.handleUn
          );
          const user_ops = [Aerospike.operations.incr("post_c", 1)];
          const user_postCount = await client.operate(user_key, user_ops);
          try {
            if (!metions.trim()) {
              var getPostData = await client.get(post_key);
              return res.status(201).json(getPostData.bins);
            } else {
              const key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_USER_META,
                metions
              );
              const ops = [Aerospike.lists.append("metions", post_id)];
              client.operate(key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  var getPostData = await client.get(post_key);
                  return res.status(201).json(getPostData.bins);
                }
              });
            }
          } catch (err) {
            return res.status(400).json({ msg: err.message });
          }
        } catch (err) {
          return res.status(400).json({ msg: err.message });
        }
      });

      blobStream.end(req.file.buffer);
    }
  }
});

// *** Fetch posts
router.get("/fetch/feed", async (req, res) => {
  // const typeArr = JSON.parse(req.query.types);
  const batchType = Aerospike.batchType;
  var posts = [];
  const handleUn = req.params.handleUn;
  const client = await getAerospikeClient();
  var myPosts = [];
  var arr = [];
  var temp = [];
  var posts = [];
  var post_temp = [];
  var post_key = [];

  let query = client.query(process.env.CLUSTER_NAME, process.env.SET_USER_META);
  const tempBin1 = "ExpVar";
  query.where(Aerospike.filter.equal("handleUn", req.user.handleUn));
  const stream = query.foreach();

  stream.on("data", function (record) {
    arr = record.bins.flw;
    myPosts = record.bins.posts;
    console.log(record.bins);
    for (let i = 0; i < arr.length; i++) {
      temp.push({
        key: new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USER_META,
          arr[i]
        ),
        readAllBins: true,
      });
    }
  });

  stream.on("end", function (record) {
    var all_post_key = [];
    var all_posts_arr = [];
    client.batchRead(temp, async (err, results) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      } else {
        for (let i = 0; i < results.length; i++) {
          all_posts_arr.push(results[i].record.bins.posts);
        }
        all_posts_arr = all_posts_arr.flat();
        for (let i = 0; i < all_posts_arr.length; i++) {
          post_key.push({
            key: new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_POSTS,
              all_posts_arr[i]
            ),
            readAllBins: true,
          });
        }
        var posts = [];
        client.batchRead(post_key, async (err, results) => {
          results.map((data) => {
            if (data.record.bins) {
              posts.push(data.record.bins);
            }
          });

          if (req.query.sortedBy === "random") {
            var page = req.query.page;
            var limit = 5;
            var start = (page - 1) * limit;
            var end = page * limit;
            var count = 0;
            console.log(start, end);
            var temp = posts.slice(start, end);
            console.log(temp);
            return res.status(200).json(temp);
          } else if (req.query.sortedBy === "popular") {
            posts = posts.sort((a, b) => b.l_c - a.l_c);
            var page = req.query.page;
            var limit = 5;
            var start = (page - 1) * limit;
            var end = page * limit;
            var count = 0;
            console.log(start, end);
            var temp = posts.slice(start, end);
            console.log(temp);
            return res.status(200).json(temp);
          } else {
            posts = posts.sort((a, b) => b.id - a.id);
            var page = req.query.page;
            var limit = 5;
            var start = (page - 1) * limit;
            var end = page * limit;
            var count = 0;
            var temp = posts.slice(start, end);
            return res.status(200).json(temp);
          }
        });
      }
    });
  });
});

// *** All feed
router.get("/feed/all", async (req, res) => {
  console.log("/feed/all");
  const client = await getAerospikeClient();
  var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
  var stream = query.foreach();
  var arr = [];
  stream.on("data", function (data) {
    arr.push(data.bins);
    // console.log(data.bins)
  });

  stream.on("end", function (posts) {
    arr = arr.sort((a, b) => b.id - a.id);
    var page = req.query.page || 1;
    var limit = req.query.limit || 5;
    var start = (page - 1) * limit;
    var end = page * limit;
    var count = 0;
    arr = arr.slice(start, end);
    console.log("ARRAY");
    return res.status(200).json(arr);
  });
});

// *** All feed
router.get("/feed/for_you", async (req, res) => {
  console.log("/feed/for_you");
  const client = await getAerospikeClient();
  var query = client.query(process.env.CLUSTER_NAME, process.env.SET_POSTS);
  var stream = query.foreach();
  var arr = [];
  stream.on("data", function (data) {
    arr.push(data.bins);
    console.log(data.bins);
  });

  stream.on("end", function (posts) {
    arr = arr.sort((a, b) => b.l_c - a.l_c);
    var page = req.query.page || 1;
    var limit = req.query.limit || 5;
    var start = (page - 1) * limit;
    var end = page * limit;
    var count = 0;
    arr = arr.slice(start, end);
    return res.status(200).json(arr);
  });
});

// *** Fetch mention posts
router.get("/fetch/mentions", async (req, res) => {
  const key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_USER_META,
    req.user.handleUn
  );
  var posts = [];
  const client = await getAerospikeClient();
  client.exists(key, async (err, result) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    } else {
      if (!result) {
        return res.status(400).json({ msg: "Invalid user" });
      } else {
        const data = await client.get(key);
        var arr = [];
        for (let i = 0; i < data.bins.mentions.length; i++) {
          if (data.bins.mentions[i].trim()) {
            arr.push(data.bins.mentions[i]);
            const temp = [];
            for (let i = 0; i < arr.length; i++) {
              temp.push({
                key: new Aerospike.Key(
                  process.env.CLUSTER_NAME,
                  process.env.SET_POSTS,
                  arr[i]
                ),
                readAllBins: true,
              });
            }
            client.batchRead(temp, async (err, results) => {
              // res.status(200).json(results);
              results.map((data) => {
                // console.log(data.record.bins)
                if (data.record.bins) {
                  posts.push(data.record.bins);
                }
              });
              posts = posts.sort((a, b) => b.id - a.id);
              return res.status(200).json(posts);
            });
          } else {
            return res.status(200).json(posts);
          }
        }
      }
    }
  });
});

// *** Post Edit
router.put("/edit/:id", async (req, res) => {
  // main_posts
  // posts
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid params" });
  } else {
    const mainPostKey = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_POSTS,
      req.params.id
    );
    const postKey = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    const ops = [Aerospike.operations.write("content", req.body.editText)];
    client.operate(mainPostKey, ops, (err, result) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      } else {
        client.operate(postKey, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Edit updated post" });
          }
        });
      }
    });
  }
});

// *** Unhelpfull news
router.post("/unhelpfull/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    var arr;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // query.select(["hide"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    const stream = query.foreach();
    stream.on("data", async function (record) {
      var incrmentedBy = 0;
      console.log(record.bins);
      if (!record.bins.unhlpfull) {
        const ops = [Aerospike.lists.append("unhlpfull", req.user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const post_ops = [Aerospike.operations.write("unhlp_c", 1)];
            client.operate(post_key, post_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res
                  .status(200)
                  .json({ msg: "You select as unhelpfull", result });
              }
            });
          }
        });
      } else {
        console.log(record.bins.unhlpfull.includes(req.user.handleUn));
        if (record.bins.unhlpfull.includes(req.user.handleUn)) {
          const ops = [
            Aerospike.lists.removeByValue("unhlpfull", req.user.handleUn),
          ];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("unhlp_c", -1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You remove from unhelpfull", result });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("unhlpfull", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("unhlp_c", 1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You select as unhelpfull" });
                }
              });
            }
          });
        }
      }
    });

    stream.on("end", async function (record) {});
  }
});

// Like announcement
router.post("/like/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    var arr;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // query.select(["hide"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    const stream = query.foreach();
    stream.on("data", async function (record) {
      var incrmentedBy = 0;
      console.log(record.bins);
      if (!record.bins.like) {
        const ops = [Aerospike.lists.append("like", req.user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const post_ops = [Aerospike.operations.write("like_c", 1)];
            client.operate(post_key, post_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res
                  .status(200)
                  .json({ msg: "Like Announcement", result });
              }
            });
          }
        });
      } else {
        console.log(record.bins.like.includes(req.user.handleUn));
        if (record.bins.like.includes(req.user.handleUn)) {
          const ops = [
            Aerospike.lists.removeByValue("like", req.user.handleUn),
          ];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("like_c", -1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Not like announcement", result });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("like", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("like_c", 1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res.status(200).json({ msg: "Like Announcement" });
                }
              });
            }
          });
        }
      }
    });

    stream.on("end", async function (record) {});
  }
});

// Importent announcement
router.post("/impotent/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    var arr;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // query.select(["hide"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    const stream = query.foreach();
    stream.on("data", async function (record) {
      var incrmentedBy = 0;
      console.log(record.bins);
      if (!record.bins.imp) {
        const ops = [Aerospike.lists.append("imp", req.user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const post_ops = [Aerospike.operations.write("imp_c", 1)];
            client.operate(post_key, post_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res
                  .status(200)
                  .json({ msg: "Impotant Announcement", result });
              }
            });
          }
        });
      } else {
        console.log(record.bins.imp.includes(req.user.handleUn));
        if (record.bins.imp.includes(req.user.handleUn)) {
          const ops = [Aerospike.lists.removeByValue("imp", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("imp_c", -1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Not Important announcement", result });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("imp", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("imp_c", 1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Important Announcement" });
                }
              });
            }
          });
        }
      }
    });

    stream.on("end", async function (record) {});
  }
});

// Scam announcement
router.post("/scam/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    var arr;
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META
    );
    const tempBin = "ExpVar"; // this bin is to hold expression read operation output
    // query.select(["hide"]); //select single bin
    query.where(Aerospike.filter.equal("id", req.params.id));

    const stream = query.foreach();
    stream.on("data", async function (record) {
      var incrmentedBy = 0;
      console.log(record.bins);
      if (!record.bins.scam) {
        const ops = [Aerospike.lists.append("scam", req.user.handleUn)];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const post_ops = [Aerospike.operations.write("scam_c", 1)];
            client.operate(post_key, post_ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res
                  .status(200)
                  .json({ msg: "Scam Announcement", result });
              }
            });
          }
        });
      } else {
        console.log(record.bins.scam.includes(req.user.handleUn));
        if (record.bins.scam.includes(req.user.handleUn)) {
          const ops = [
            Aerospike.lists.removeByValue("scam", req.user.handleUn),
          ];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("scam_c", -1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "Not Scam announcement", result });
                }
              });
            }
          });
        } else {
          const ops = [Aerospike.lists.append("scam", req.user.handleUn)];
          client.operate(post_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const post_ops = [Aerospike.operations.incr("scam_c", 1)];
              client.operate(post_key, post_ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res.status(200).json({ msg: "Scam Announcement" });
                }
              });
            }
          });
        }
      }
    });

    stream.on("end", async function (record) {});
  }
});

// *** Rendering EMOJI
router.get("/fetch/emoji", async (req, res) => {
  const client = await getAerospikeClient();
  let query = client.query(process.env.CLUSTER_NAME, "emoji_data");
  const tempBin1 = "ExpVar";
  const stream = query.foreach();
  var arr = [];
  stream.on("data", function (record) {
    arr.push(record.bins);
  });

  stream.on("end", function (record) {
    var page = req.query.page;
    var limit = 20;
    var start = (page - 1) * limit;
    var end = page * limit;
    var count = 0;

    var temp = arr.slice(start, end);

    return res.status(200).json(temp);
  });
});

// *** Rendering EMOJI
router.get("/fetch/crypto/price", async (req, res) => {
  const client = await getAerospikeClient();
  let query = client.query(process.env.CLUSTER_NAME, "crypto_price");
  const tempBin1 = "ExpVar";
  const stream = query.foreach();
  var arr = [];
  stream.on("data", function (record) {
    arr.push(record.bins);
  });

  stream.on("end", function (record) {
    var page = req.query.page;
    var limit = 20;
    var start = (page - 1) * limit;
    var end = page * limit;
    var count = 0;

    var temp = arr.slice(start, end);

    return res.status(200).json(temp);
  });
});

// *** Social post like
router.put("/emoji/like/:id", async (req, res) => {
  console.log("EMOJI LIKE");
  const id = req.params.id;
  const client = await getAerospikeClient();
  // console.log(req.params.id);
  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );

    const post = await client.get(post_key);
    // *** save notification data
    const map_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_APP_HISTORY,
      post.bins.u_dun
    );
    var notificationData = {
      id: id,
      ty: 1,
      vi: false,
      wo: req.user.handleUn,
      ti: Date.now(),
      nm: `${req.user.fn} ${req.user.ln}`,
      pi: req.user.p_i,
      cat: 1,
      re: post.bins.u_dun,
    };

    if (post.bins.u_dun !== req.user.handleUn) {
      const map_ops = [
        Aerospike.operations.write("n_id", post.bins.u_dun),
        Aerospike.maps.put("notification", Date.now(), notificationData, {
          order: maps.order.KEY_ORDERED,
        }),
        Aerospike.operations.incr("count", 1),
      ];
      let result = await client.operate(map_key, map_ops);
    }
    if (post.bins.l_c > 0) {
      console.log("Like count is not 0");
      const meta = await client.get(post_meta_key);
      if (meta.bins.likes.includes(req.user.handleUn)) {
        const ops = [Aerospike.lists.removeByValue("likes", req.user.handleUn)];
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
              const ops = [Aerospike.lists.append("likes", req.user.handleUn)];
              client.operate(post_meta_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // return res.status(200).json({ msg: "You liked this post" });
                  if (meta.bins.likes.length === 0) {
                    const ops = [Aerospike.operations.incr("like", 1)];
                    const data = await client.operate(post_key, ops);

                    // return res.status(200).json({ msg: "Liked post" });
                    if (post.bins.u_dun === req.user.handleUn) {
                      return res.status(200).json({ msg: "Liked post" });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
                    }
                  } else {
                    if (post.bins.u_dun === req.user.handleUn) {
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
                    }
                  }
                }
              });
            }
          });
        } else {
          console.log("Not previouly reacted");
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
                  if (meta.bins.likes.length === 0) {
                    const ops = [Aerospike.operations.incr("like", 1)];
                    const data = await client.operate(post_key, ops);
                    // return res.status(200).json({ msg: "Liked post" });
                    if (post.bins.u_dun === req.user.handleUn) {
                      consople.log("post owner");
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
                            .json({ msg: "Liked post", notificationData });
                        } else {
                          return res
                            .status(200)
                            .json({ msg: "Liked post", notificationData });
                        }
                      } else {
                        console.log("Non Popular");
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
                            .json({ msg: "Liked post", notificationData });
                        } else {
                          return res
                            .status(200)
                            .json({ msg: "Liked post", notificationData });
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
                          return res
                            .status(200)
                            .json({ msg: "Liked post", notificationData });
                        } else {
                          return res
                            .status(200)
                            .json({ msg: "Liked post", notificationData });
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
                            .json({ msg: "Liked post", notificationData });
                        } else {
                          return res
                            .status(200)
                            .json({ msg: "Liked post", notificationData });
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
          const ops = [Aerospike.operations.incr("l_c", 1)];
          client.operate(post_key, ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              // return res.status(200).json({ msg: "Liked post" });
              // ***
              if (post.bins.u_dun === req.user.handleUn) {
                return res.status(200).json({ msg: "Liked post" });
              } else {
                // const notiData = await client.get(map_key);
                if (req.user.flwr_c > 2) {
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
                      .json({ msg: "Liked post", notificationData });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "Liked post", notificationData });
                  }
                } else {
                  console.log("Normal **");
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
                      .json({ msg: "Liked post", notificationData });
                  } else {
                    return res
                      .status(200)
                      .json({ msg: "Liked post", notificationData });
                  }
                }
              }
            }
          });
        }
      });
    }
  }
});

// *** Social post haha
router.put("/emoji/haha/:id", async (req, res) => {
  console.log("EMOJI HAHA");
  const id = req.params.id;
  const client = await getAerospikeClient();

  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );

    const post = await client.get(post_key);

    try {
      // *** save notification data
      const map_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        post.bins.u_dun
      );
      var notificationData = {
        id: id,
        ty: 1,
        vi: false,
        wo: req.user.handleUn,
        ti: Date.now(),
        nm: `${req.user.fn} ${req.user.ln}`,
        pi: req.user.p_i,
        cat: 3,
        re: post.bins.u_dun,
      };

      if (post.bins.u_dun !== req.user.handleUn) {
        const map_ops = [
          Aerospike.operations.write("n_id", post.bins.u_dun),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
      }

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
                const ops = [Aerospike.lists.append("haha", req.user.handleUn)];
                client.operate(post_meta_key, ops, async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    if (meta.bins.haha.length === 0) {
                      if (post.bins.u_dun === req.user.handleUn) {
                        return res
                          .status(200)
                          .json({ msg: "HAHA post", notificationData });
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
                              .json({ msg: "HAHA post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "HAHA post", notificationData });
                          }
                        } else {
                          console.log("Normal haha");
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
                              .json({ msg: "HAHA post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "HAHA post", notificationData });
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
                            return res
                              .status(200)
                              .json({ msg: "HAHA post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "haha post", notificationData });
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
                              .json({ msg: "haha post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "haha post", notificationData });
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
                      // return res.status(200).json({ msg: "haha post" });
                      if (post.bins.u_dun === req.user.handleUn) {
                        return res
                          .status(200)
                          .json({ msg: "Liked post", notificationData });
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
                              .json({ msg: "Liked post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Liked post", notificationData });
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
                              .json({ msg: "Liked post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Liked post", notificationData });
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
                              .json({ msg: "Liked post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Liked post", notificationData });
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
                              .json({ msg: "Liked post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Liked post", notificationData });
                          }
                        }
                      }
                      return res
                        .status(200)
                        .json({ msg: "haha post", notificationData });
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
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
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
                        .json({ msg: "Liked post", notificationData });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Liked post", notificationData });
                    }
                  }
                }
              }
            });
          }
        });
      }
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
});

// *** Social post dislike
router.put("/emoji/dislike/:id", async (req, res) => {
  const id = req.params.id;
  const client = await getAerospikeClient();

  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );

    const post = await client.get(post_key);
    try {
      // *** save notification data
      const map_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        post.bins.u_dun
      );
      var notificationData = {
        id: id,
        ty: 1,
        vi: false,
        wo: req.user.handleUn,
        ti: Date.now(),
        nm: `${req.user.fn} ${req.user.ln}`,
        pi: req.user.p_i,
        cat: 2,
        re: post.bins.u_dun,
      };

      if (post.bins.u_dun !== req.user.handleUn) {
        const map_ops = [
          Aerospike.operations.write("n_id", post.bins.u_dun),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
      }

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
              const ops = [Aerospike.operations.incr("l_c", -1)];
              client.operate(post_key, ops, async (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  // return res.status(200).json({ msg: "Dislikes added" });
                  if (meta.bins.haha.length === 1) {
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
                              .json({ msg: "Dislike post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Dislike post", notificationData });
                          }
                        } else {
                          console.log("Normal dislike");
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
                              .json({ msg: "Dislike post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Dislike post", notificationData });
                          }
                        }
                      }
                    } else {
                      // return res.status(200).json({ msg: "Dislikes added" });
                      if (post.bins.u_dun === req.user.handleUn) {
                        return res
                          .status(200)
                          .json({ msg: "Dislike post", notificationData });
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
                              .json({ msg: "Dislike post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Dislike post", notificationData });
                          }
                        } else {
                          console.log("Normal dislike **");
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
                              .json({ msg: "Dislike post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Dislike post", notificationData });
                          }
                        }
                      }
                    }
                  }
                });
              }
            });
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
                      return res
                        .status(200)
                        .json({ msg: "Dislikes added", notificationData });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Dislikes added", notificationData });
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
                return res
                  .status(200)
                  .json({ msg: "Dislikes added", notificationData });
              }
            });
          }
        });
      }
    } catch (error) {
      return res.status(400).json({ msg: err.message });
    }
  }
});

// *** Social post angry
router.put("/emoji/angry/:id", async (req, res) => {
  console.log("EMOJI Angry");
  const id = req.params.id;
  const client = await getAerospikeClient();
  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      id
    );

    const post = await client.get(post_key);

    try {
      // *** save notification data
      const map_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        post.bins.u_dun
      );
      var notificationData = {
        id: id,
        ty: 1,
        vi: false,
        wo: req.user.handleUn,
        ti: Date.now(),
        nm: `${req.user.fn} ${req.user.ln}`,
        pi: req.user.p_i,
        cat: 4,
        re: post.bins.u_dun,
      };
      if (post.bins.u_dun !== req.user.handleUn) {
        const map_ops = [
          Aerospike.operations.write("n_id", post.bins.u_dun),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
      }

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
                      return res
                        .status(200)
                        .json({ msg: "angry added", notificationData });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "angry added", notificationData });
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
                              .json({ msg: "Angry post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Angry post", notificationData });
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
                              .json({ msg: "Angry post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Angry post", notificationData });
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
                              .json({ msg: "Angry post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Angry post", notificationData });
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
                              .json({ msg: "Angry post", notificationData });
                          } else {
                            return res
                              .status(200)
                              .json({ msg: "Angry post", notificationData });
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
                return res
                  .status(200)
                  .json({ msg: "angry added", notificationData });
              }
            });
          }
        });
      }
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
});

// *********** INFORMATIVE POST ********* //
// *** Helpfull Information post
router.post("/helpfull/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);
    if (data.bins.unhlp && data.bins.unhlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("unhlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("unhlp_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.lists.append("hlp", req.user.handleUn)];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("hlp_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "Helpfull info" });
                  }
                });
              }
            });
          }
        });
      });
    } else if (data.bins.misld && data.bins.misld.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("misld", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("misld_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.lists.append("hlp", req.user.handleUn)];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("hlp_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "Helpfull info" });
                  }
                });
              }
            });
          }
        });
      });
    } else if (data.bins.hlp && data.bins.hlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("hlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("hlp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "remove Helpfull info" });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("hlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("hlp_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Helpfull info" });
            }
          });
        }
      });
    }
  }
});

// *** Unhelpfull Information post
router.post("/unhelpfull/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.unhlp && data.bins.unhlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("unhlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("unhlp_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Remove unhelpfull info" });
          }
        });
      });
    } else if (data.bins.misld && data.bins.misld.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("misld", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("misld_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.lists.append("unhlp", req.user.handleUn)];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("unhlp_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "Helpfull info" });
                  }
                });
              }
            });
          }
        });
      });
    } else if (data.bins.hlp && data.bins.hlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("hlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("hlp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("unhlp", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                const ops = [Aerospike.operations.incr("unhlp_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "unhelpfull info" });
                  }
                });
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("unhlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("unhlp_c", 1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "unhelpfull info" });
          }
        });
      });
    }
  }
});

// *** Unhelpfull Information post
router.post("/misleading/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.misld && data.bins.misld.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("misld", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("misld_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Remove misleading info" });
          }
        });
      });
    } else if (data.bins.hlp && data.bins.hlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("hlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("hlp_c", -1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.lists.append("misld", req.user.handleUn)];
            client.operate(post_meta_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("misld_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "Helpfull info" });
                  }
                });
              }
            });
          }
        });
      });
    } else if (data.bins.unhlp && data.bins.unhlp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("unhlp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("unhlp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("misld", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                const ops = [Aerospike.operations.incr("misld_c", 1)];
                client.operate(post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "unhelpfull info" });
                  }
                });
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("misld", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        const ops = [Aerospike.operations.incr("misld_c", 1)];
        client.operate(post_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "unhelpfull info" });
          }
        });
      });
    }
  }
});

// *********** News POST ********* //
// *** Reliable news
router.post("/reliable/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.relib && data.bins.relib.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("relib", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("relib_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Remove Reliable news" });
            }
          });
        }
      });
    } else if (
      data.bins.intrst &&
      data.bins.intrst.includes(req.user.handleUn)
    ) {
      const ops = [Aerospike.lists.removeByValue("intrst", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("intrst_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("relib", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("relib_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Reliable news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (data.bins.fake && data.bins.fake.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("fake", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("fake_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("relib", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("relib_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Reliable news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("relib", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("relib_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Reliable news" });
            }
          });
        }
      });
    }
  }
});

// *** Interesting news
router.post("/interesting/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.intrst && data.bins.intrst.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("intrst", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("intrst_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Remove Interesting news" });
            }
          });
        }
      });
    } else if (data.bins.relib && data.bins.relib.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("relib", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("relib_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("intrst", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("intrst_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Intersting news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (data.bins.fake && data.bins.fake.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("fake", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("fake_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("intrst", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("intrst_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Intersting news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("intrst", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("intrst_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Intersting news" });
            }
          });
        }
      });
    }
  }
});

// *** Fake news
router.post("/fake/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.fake && data.bins.fake.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("fake", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("fake_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Remove Fake news" });
            }
          });
        }
      });
    } else if (data.bins.relib && data.bins.relib.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("relib", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("relib_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("fake", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("fake_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Fake news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (
      data.bins.intrst &&
      data.bins.intrst.includes(req.user.handleUn)
    ) {
      const ops = [Aerospike.lists.removeByValue("intrst", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("intrst_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("fake", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("fake_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Fake news" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("fake", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("fake_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Fake news" });
            }
          });
        }
      });
    }
  }
});

// *********** Announcement POST ********* //
// ** Like post
router.post("/announcement/like/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);
    if (data.bins.like && data.bins.like.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("like", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("like_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "remove Like announcement" });
            }
          });
        }
      });
    } else if (data.bins.imp && data.bins.imp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("imp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("imp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("like", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("like_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Like announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (data.bins.scam && data.bins.scam.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("scam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("scam_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("like", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("like_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "Like announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("like", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("like_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Like announcement" });
            }
          });
        }
      });
    }
  }
});

// Importent post
router.post("/announcement/impotent/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.imp && data.bins.imp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("imp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("imp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res
                .status(200)
                .json({ msg: "remove Importent announcement" });
            }
          });
        }
      });
    } else if (data.bins.like && data.bins.like.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("like", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("like_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("imp", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("imp_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Importent announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (data.bins.scam && data.bins.scam.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("scam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("scam_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("imp", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("imp_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res
                        .status(200)
                        .json({ msg: "Importent announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("imp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("imp_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "Importent announcement" });
            }
          });
        }
      });
    }
  }
});

// Importent post
router.post("/announcement/scam/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const client = await getAerospikeClient();
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const data = await client.get(post_meta_key);

    if (data.bins.scam && data.bins.scam.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("scam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("scam_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "remove scam announcement" });
            }
          });
        }
      });
    } else if (data.bins.like && data.bins.like.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("like", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("like_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("scam", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("scam_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "scam announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else if (data.bins.imp && data.bins.imp.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("imp", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("imp_c", -1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("scam", req.user.handleUn)];
              client.operate(post_meta_key, ops, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  const ops = [Aerospike.operations.incr("scam_c", 1)];
                  client.operate(post_key, ops, (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      return res.status(200).json({ msg: "scam announcement" });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      const ops = [Aerospike.lists.append("scam", req.user.handleUn)];
      client.operate(post_meta_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("scam_c", 1)];
          client.operate(post_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              return res.status(200).json({ msg: "scam announcement" });
            }
          });
        }
      });
    }
  }
});

// *** Fetch full post
router.get("/full/:id", async (req, res) => {
  console.log("fetch comment ", req.query.page);
  const post_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_POSTS,
    req.params.id
  );
  const client = await getAerospikeClient();

  client.exists(post_key, async (err, data) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    } else {
      if (!data) {
        return res.status(400).json({ msg: "No post found" });
      } else {
        const post = await client.get(post_key);
        try {
          return res.status(200).json(post);
        } catch (error) {
          return res.status(400).json({ msg: error.message });
        }
      }
    }
  });
});

router.get("/fetch/post/analytics/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    console.log(req.params.id);
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
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
});

router.post("/donate/:id", async (req, res) => {
  const client = await getAerospikeClient();
  const id = req.params.id;
  console.log(req.query);
  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
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

    const data = await client.get(post_key);
    try {
      // *** save notification data
      const map_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_APP_HISTORY,
        data.bins.u_dun
      );
      const map_ops = [
        Aerospike.operations.write("n_id", data.bins.u_dun),
        Aerospike.maps.put(
          "notification",
          Date.now(),
          {
            id: id,
            ty: 7,
            vi: false,
            wo: req.user.handleUn,
            ti: Date.now(),
            nm: `${req.user.fn} ${req.user.ln}`,
            pi: req.user.p_i,
            amount: req.query.amount,
          },
          {
            order: maps.order.KEY_ORDERED,
          }
        ),
        Aerospike.operations.incr("count", 1),
      ];
      let result = await client.operate(map_key, map_ops);
      client.exists(post_meta_key, async (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          if (!result) {
            return res.status(400).json({ msg: "No post found" });
          } else {
            // ** Generating time stamp
            const time = Date.now().toString();
            let record = await client.get(post_meta_key);

            const bins = {
              id: time,
              amount: req.query.amount,
              s_name: `${req.user.fn} ${req.user.ln}`,
              s_handleUn: req.user.handleUn,
              s_pic: req.user.p_i || "",
              r_username: req.query.handleUn,
              postId: id,
              message: req.query.message || "",
            };
            const earn_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_EARNING,
              time
            );
            const user_meta_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_USER_META,
              req.query.handleUn
            );

            client.put(earn_key, bins, async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
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
                      return res.status(400).json({ msg: err.message });
                    } else {
                      if (result.bins.earn[0] === time) {
                        const value =
                          Number(result.bins.earn[1]) +
                          Number(req.query.amount);

                        const ops = [
                          Aerospike.maps.put("earn", time, value, {
                            order: maps.order.KEY_ORDERED,
                          }),
                        ];
                        let data = await client.operate(post_meta_key, ops);
                        try {
                          return res.status(200).json({ msg: "Success" });
                        } catch (error) {
                          return res.status(400).json({ msg: error.message });
                        }
                      } else {
                        const ops = [
                          Aerospike.maps.put("earn", time, req.query.amount, {
                            order: maps.order.KEY_ORDERED,
                          }),
                        ];
                        let result = await client.operate(post_meta_key, ops);
                        try {
                          let result = await client.operate(user_meta_key, ops);
                          try {
                            return res.status(200).json({ msg: "Success" });
                          } catch (error) {
                            return res.status(400).json({ msg: error.message });
                          }
                        } catch (error) {
                          return res.status(400).json({ msg: error.message });
                        }
                      }
                    }
                  });
                } else {
                  const ops = [
                    Aerospike.maps.put("earn", time, req.query.amount, {
                      order: maps.order.KEY_ORDERED,
                    }),
                  ];
                  let result = await client.operate(post_meta_key, ops);
                  try {
                    let result = await client.operate(user_meta_key, ops);
                    try {
                      return res.status(200).json({ msg: "Success" });
                    } catch (error) {
                      return res.status(400).json({ msg: err.message });
                    }
                  } catch (error) {
                    return res.status(400).json({ msg: error.message });
                  }
                }
              }
            });
          }
        }
      });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
});

router.get("/fetch/donate/history/:id", async (req, res) => {
  const id = req.params.id;
  const client = await getAerospikeClient();
  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    let query = client.query(process.env.CLUSTER_NAME, process.env.SET_EARNING);
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("postId", req.params.id));
    const stream = query.foreach();
    let arr = [];

    stream.on("data", async function (record) {
      arr.push(record.bins);
    });

    stream.on("end", async function (record) {
      // Sort according to the amount
      // arr = arr.slice((a, b) => Number(a.amount) - Number(b.amount))
      arr = arr.slice((a, b) => b.Number(id) - a.Number(id));
      temp = arr.slice(0, 5);
      return res.status(200).json(temp);
    });
  }
});

router.get("/fetch/single/details/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).jons({ msg: "Invalid request" });
  } else {
    const earn_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_EARNING,
      id
    );
    const client = await getAerospikeClient();

    client.exists(earn_key, async (err, result) => {
      if (err) {
        return res.status(400).json({ msg: err.message });
      } else {
        const data = await client.get(earn_key);
        try {
          return res.status(200).json(data.bins);
        } catch (error) {
          return res.status(400).json({ msg: err.message });
        }
      }
    });
  }
});

router.get("/fetch/nft/post/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
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
    query.where(Aerospike.filter.equal("postId", req.params.id));
    const stream = query.foreach();
    const arr = [];
    stream.on("data", function (record) {
      arr.push(record.bins);
    });

    stream.on("end", async function (record) {
      // console.log(arr);
      var temp = arr.sort((a, b) => b.l_c - a.l_c);
      const data = await client.get(post_key);
      const comment = temp[0];
      try {
        return res.status(200).json({ post: data.bins, comment: comment });
      } catch (error) {
        return res.status(400).json({ msg: error.message });
      }
    });
  }
});

router.post("/upload/nft/image", (req, res) => {
  console.log("Call ", req.body);
});

// **** Post comment **** //
// Create post comment
router.post("/comment/:id", multer.single("c_img"), async (req, res) => {
  const batchType = Aerospike.batchType;
  const client = await getAerospikeClient();
  const comment_id = now.micro();
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    // *** Create post key (FEED)
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      req.params.id
    );
    const post = await client.get(post_key);

    const post_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS_META,
      req.params.id
    );

    // *** Create post key (MAIN)
    const main_post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_MAIN_POSTS,
      req.params.id
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

    if (!req.file) {
      for (let i = 0; i < batchArrKeys.length; i++) {
        console.log("SET NAME: ", batchArrKeys[i].set);
        if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
          batchRecords.push({
            type: batchType.BATCH_WRITE,
            key: batchArrKeys[i],
            ops: [
              Aerospike.operations.write("id", comment_id),
              Aerospike.operations.write("comment", req.body.comment || ""),
              Aerospike.operations.write("gif", req.body.gif || ""),
              Aerospike.operations.write("l_c", 0),
              Aerospike.operations.write("d_c", 0),
              Aerospike.operations.write("s_c", 0),
              Aerospike.operations.write("hide", 0),
              Aerospike.operations.write("c_t", new Date().getTime()),
              Aerospike.operations.write("u_t", new Date().getTime()),
              Aerospike.operations.write("c_fn", req.user.fn),
              Aerospike.operations.write("c_ln", req.user.ln),
              Aerospike.operations.write("c_u_du", req.user.handleUn),
              Aerospike.operations.write("c_u_img", req.user.p_i),
              Aerospike.operations.write("pinn", false),
              Aerospike.operations.write("delete", false),
              Aerospike.operations.write("reply_c", 0),
              Aerospike.operations.write("postId", req.params.id),
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
        if (req.user.handleUn !== post.bins.u_dun) {
          // *** save notification data
          const map_key = new Aerospike.Key(
            process.env.CLUSTER_NAME,
            process.env.SET_APP_HISTORY,
            post.bins.u_dun
          );
          const notificationData = {
            id: req.params.id,
            ty: 2,
            vi: false,
            wo: req.user.handleUn,
            ti: Date.now(),
            nm: `${req.user.fn} ${req.user.ln}`,
            pi: req.user.p_i,
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
          return res.status(200).json({ comment: data.bins, notificationData });
        } else {
          return res.status(200).json(data.bins);
        }
      } catch (error) {
        return res.status(400).json({ msg: error.message });
      }
    } else {
      const newImageName = req.file.originalname;
      const blob = bucket.file(newImageName);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        console.log(err);
        return res.status(400).json({ msg: err.message });
      });

      blobStream.on("finish", async () => {
        var publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
        for (let i = 0; i < batchArrKeys.length; i++) {
          if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
            batchRecords.push({
              type: batchType.BATCH_WRITE,
              key: batchArrKeys[i],
              ops: [
                Aerospike.operations.write("id", comment_id),
                Aerospike.operations.write("comment", req.body.comment || ""),
                Aerospike.operations.write("img", publicURL),
                Aerospike.operations.write("gif", req.body.gif || ""),
                Aerospike.operations.write("l_c", 0),
                Aerospike.operations.write("d_c", 0),
                Aerospike.operations.write("s_c", 0),
                Aerospike.operations.write("hide", 0),
                Aerospike.operations.write("c_t", new Date().getTime()),
                Aerospike.operations.write("u_t", new Date().getTime()),
                Aerospike.operations.write("c_fn", req.user.fn),
                Aerospike.operations.write("c_ln", req.user.ln),
                Aerospike.operations.write("c_u_du", req.user.handleUn),
                Aerospike.operations.write("c_u_img", req.user.p_i),
                Aerospike.operations.write("pinn", false),
                Aerospike.operations.write("delete", false),
                Aerospike.operations.write("reply_c", 0),
                Aerospike.operations.write("postId", req.params.id),
              ],
            });
          } else if (
            batchArrKeys[i].set === process.env.SET_POST_COMMENT_META
          ) {
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
        try {
          const data = await client.get(post_comment_key);
          try {
            // ***** ADD ***** //
            var analytics_key = `${new Date().getDate()}-${
              new Date().getMonth() + 1
            }-${new Date().getFullYear()}`;
            const map = {
              likes: post.bins.l_c,
              comments: post.bins.c_c + 1,
              shares: post.bins.share_c,
            };
            let mapOps = [
              maps.put("analytics", analytics_key, map, {
                order: maps.order.KEY_ORDERED,
              }),
            ];
            let result = await client.operate(post_meta_key, mapOps);

            // *** Send post comment notification
            if (req.user.handleUn !== post.bins.u_dun) {
              // *** save notification data
              const map_key = new Aerospike.Key(
                process.env.CLUSTER_NAME,
                process.env.SET_APP_HISTORY,
                post.bins.u_dun
              );
              const notificationData = {
                id: req.params.id,
                ty: 2,
                vi: false,
                wo: req.user.handleUn,
                ti: Date.now(),
                nm: `${req.user.fn} ${req.user.ln}`,
                pi: req.user.p_i,
                re: post.bins.u_dun,
              };
              const map_ops = [
                Aerospike.operations.write("n_id", post.bins.u_dun),
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
              return res
                .status(200)
                .json({ comment: data.bins, notificationData });
            } else {
              return res.status(200).json(data.bins);
            }
          } catch (error) {
            return res.status(400).json({ msg: error.message });
          }
        } catch (error) {
          return res.status(400).json({ msg: error.message });
        }
      });

      blobStream.end(req.file.buffer);
    }
  }
});

router.get("/comment/:id", async (req, res) => {
  const client = await getAerospikeClient();
  const batchType = Aerospike.batchType;
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid" });
  } else {
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("postId", req.params.id));
    const stream = query.foreach();
    const arr = [];
    var sortedBy = req.query.sortedBy;
    stream.on("data", function (record) {
      if (req.user.handleUn !== record.bins.c_u_du) {
        arr.push(record.bins);
      }
    });

    stream.on("end", function (record) {
      if (sortedBy === "old") {
        var temp = arr.sort((a, b) => a.id - b.id);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      } else if (sortedBy === "pop ") {
        var temp = arr.sort((a, b) => b.l_c - a.l_c);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      } else {
        var temp = arr.sort((a, b) => b.id - a.id);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      }
    });
  }
});

// *** Fetch my comment
router.get("/my_comment/:id", async (req, res) => {
  const client = await getAerospikeClient();
  const batchType = Aerospike.batchType;
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid" });
  } else {
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("postId", req.params.id));
    const stream = query.foreach();
    const arr = [];
    stream.on("data", function (record) {
      if (req.user.handleUn === record.bins.c_u_du) {
        arr.push(record.bins);
      }
    });

    var sortedBy = req.query.sortedBy;

    stream.on("end", function (record) {
      if (sortedBy === "old") {
        var temp = arr.sort((a, b) => a.id - b.id);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      } else if (sortedBy === "po") {
        var temp = arr.sort((a, b) => b.l_c - a.l_c);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      } else {
        var temp = arr.sort((a, b) => b.id - a.id);
        const page = req.query.page;
        const limit = req.query.limit;
        const sortedBy = req.query.sortedBy;
        var start = (page - 1) * limit;
        var end = page * limit;
        var data = temp.slice(start, end);
        return res.status(200).json(data);
      }
    });
  }
});

// Pinned Post Comment
router.put("/comment/pinned/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var data;

    stream.on("data", function (record) {
      data = record.bins;
    });
    stream.on("end", function (record) {
      console.log(data);
      if (data.pinn) {
        const ops = [Aerospike.operations.write("pinn", false)];
        client.operate(post_comment_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Unpinned comment" });
          }
        });
      } else {
        const ops = [Aerospike.operations.write("pinn", true)];
        client.operate(post_comment_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            return res.status(200).json({ msg: "Pinned comment" });
          }
        });
      }
    });
  }
});

// Delete post Comment
router.put("/comment/delete/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var data;

    stream.on("data", function (record) {
      data = record.bins;
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
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("c_c", -1)];
            client.operate(post_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [Aerospike.operations.incr("c_c", -1)];
                client.operate(main_post_key, ops, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    return res.status(200).json({ msg: "Comment deleted" });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

// Edit post comment
router.put("/comment/edit/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var data;

    stream.on("data", function (record) {
      data = record.bins;
    });
    stream.on("end", function (record) {
      const ops = [Aerospike.operations.write("comment", req.body.text)];
      client.operate(post_comment_key, ops, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          return res.status(200).json({ msg: "Comment updated" });
        }
      });
    });
  }
});

// **** Post comment emoji **** //
// *** Like
// router.put("/comment/like/:id", async (req, res) => {
//   if (!req.params.id) {
//     return res.status(400).json({ msg: "Invalid request params" });
//   } else {
//     const client = await getAerospikeClient();
//     const post_comment_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POST_COMMENT,
//       req.params.id
//     );

//     const post_comment_meta_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POST_COMMENT_META,
//       req.params.id
//     );
//     const commentData = await client.get(post_comment_key);
//     if (commentData.bins.l_c > 0) {
//       console.log("## LIKE COUNT IS GREATER THAN 0 ##");
//       const commentMeta = await client.get(post_comment_meta_key);
//       if (commentMeta.bins.likes.includes(req.user.handleUn)) {
//         const removeLikeArr = [
//           Aerospike.lists.removeByValue("likes", req.user.handleUn),
//         ];
//         client.operate(
//           post_comment_meta_key,
//           removeLikeArr,
//           async (err, result) => {
//             if (err) {
//               return res.status(400).json({ msg: err.message });
//             } else {
//               const decrLikeCount = [Aerospike.operations.incr("l_c", -1)];
//               client.operate(post_comment_key, decrLikeCount, (err, result) => {
//                 if (err) {
//                   return res.status(400).json({ msg: err.message });
//                 } else {
//                   return res
//                     .status(200)
//                     .json({ msg: "You remove your comment like" });
//                 }
//               });
//             }
//           }
//         );
//       } else {
//         if (
//           commentMeta.bins.haha.includes(req.user.handleUn) ||
//           commentMeta.bins.angry.includes(req.user.handleUn) ||
//           commentMeta.bins.dislikes.includes(req.user.handleUn)
//         ) {
//           const ops = [
//             Aerospike.lists.removeByValue("haha", req.user.handleUn),
//             Aerospike.lists.removeByValue("angry", req.user.handleUn),
//             Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
//           ];
//           client.operate(post_comment_meta_key, ops, (err, result) => {
//             if (err) {
//               return res.status(400).json({ msg: err.message });
//             } else {
//               const ops = [Aerospike.lists.append("likes", req.user.handleUn)];
//               client.operate(
//                 post_comment_meta_key,
//                 ops,
//                 async (err, result) => {
//                   if (err) {
//                     return res.status(400).json({ msg: err.message });
//                   } else {
//                     if (commentData.bins.c_u_du !== req.user.handleUn) {
//                       const map_key = new Aerospike.Key(
//                         process.env.CLUSTER_NAME,
//                         process.env.SET_APP_HISTORY,
//                         commentData.bins.c_u_du
//                       );
//                       const notificationData = {
//                         id: commentData.bins.postId,
//                         ty: 4,
//                         vi: false,
//                         wo: req.user.handleUn,
//                         ti: Date.now(),
//                         nm: `${req.user.fn} ${req.user.ln}`,
//                         pi: req.user.p_i,
//                         cat: 1,
//                         re: commentData.bins.c_u_du,
//                       };
//                       const map_ops = [
//                         Aerospike.operations.write(
//                           "n_id",
//                           commentData.bins.c_u_du
//                         ),
//                         Aerospike.maps.put(
//                           "notification",
//                           Date.now(),
//                           notificationData,
//                           {
//                             order: maps.order.KEY_ORDERED,
//                           }
//                         ),
//                         Aerospike.operations.incr("count", 1),
//                       ];
//                       let result = await client.operate(map_key, map_ops);
//                       return res
//                         .status(200)
//                         .json({ msg: "Comment liked", notificationData });
//                     } else {
//                       return res.status(200).json({ msg: "Comment liked" });
//                     }
//                   }
//                 }
//               );
//             }
//           });
//         } else {
//           const appendLikeArr = [
//             Aerospike.lists.append("likes", req.user.handleUn),
//           ];
//           client.operate(
//             post_comment_meta_key,
//             appendLikeArr,
//             async (err, result) => {
//               if (err) {
//                 return res.status(400).json({ msg: error.message });
//               } else {
//                 const incrLike = [Aerospike.operations.incr("l_c", 1)];
//                 client.operate(
//                   post_comment_key,
//                   incrLike,
//                   async (err, result) => {
//                     if (err) {
//                       return res.status(400).json({ msg: err.message });
//                     } else {
//                       // *** Notification send
//                       if (commentData.bins.c_u_du !== req.user.handleUn) {
//                         const map_key = new Aerospike.Key(
//                           process.env.CLUSTER_NAME,
//                           process.env.SET_APP_HISTORY,
//                           commentData.bins.c_u_du
//                         );
//                         const notificationData = {
//                           id: commentData.bins.postId,
//                           ty: 4,
//                           vi: false,
//                           wo: req.user.handleUn,
//                           ti: Date.now(),
//                           nm: `${req.user.fn} ${req.user.ln}`,
//                           pi: req.user.p_i,
//                           cat: 1,
//                           re: commentData.bins.c_u_du,
//                         };
//                         const map_ops = [
//                           Aerospike.operations.write(
//                             "n_id",
//                             commentData.bins.c_u_du
//                           ),
//                           Aerospike.maps.put(
//                             "notification",
//                             Date.now(),
//                             notificationData,
//                             {
//                               order: maps.order.KEY_ORDERED,
//                             }
//                           ),
//                           Aerospike.operations.incr("count", 1),
//                         ];
//                         let result = await client.operate(map_key, map_ops);
//                         return res
//                           .status(200)
//                           .json({ msg: "Comment liked", notificationData });
//                       } else {
//                         return res.status(200).json({ msg: "Comment liked" });
//                       }
//                     }
//                   }
//                 );
//               }
//             }
//           );
//         }
//       }
//     } else {
//       console.log("## LIKE COUNT IS 0 ##");
//       const appendLikeArr = [
//         Aerospike.lists.append("likes", req.user.handleUn),
//       ];
//       client.operate(
//         post_comment_meta_key,
//         appendLikeArr,
//         async (err, result) => {
//           if (err) {
//             return res.status(400).json({ msg: error.message });
//           } else {
//             const incrLike = [Aerospike.operations.incr("l_c", 1)];
//             client.operate(post_comment_key, incrLike, async (err, result) => {
//               if (err) {
//                 return res.status(400).json({ msg: err.message });
//               } else {
//                 // *** Notification send
//                 if (commentData.bins.c_u_du !== req.user.handleUn) {
//                   const map_key = new Aerospike.Key(
//                     process.env.CLUSTER_NAME,
//                     process.env.SET_APP_HISTORY,
//                     commentData.bins.c_u_du
//                   );
//                   const notificationData = {
//                     id: commentData.bins.postId,
//                     ty: 4,
//                     vi: false,
//                     wo: req.user.handleUn,
//                     ti: Date.now(),
//                     nm: `${req.user.fn} ${req.user.ln}`,
//                     pi: req.user.p_i,
//                     cat: 1,
//                     re: commentData.bins.c_u_du,
//                   };
//                   const map_ops = [
//                     Aerospike.operations.write("n_id", commentData.bins.c_u_du),
//                     Aerospike.maps.put(
//                       "notification",
//                       Date.now(),
//                       notificationData,
//                       {
//                         order: maps.order.KEY_ORDERED,
//                       }
//                     ),
//                     Aerospike.operations.incr("count", 1),
//                   ];
//                   let result = await client.operate(map_key, map_ops);
//                   return res
//                     .status(200)
//                     .json({ msg: "Comment liked", notificationData });
//                 } else {
//                   return res.status(200).json({ msg: "Comment liked" });
//                 }
//               }
//             });
//           }
//         }
//       );
//     }
//   }
// });

// *** Dislike
router.put("/comment/dislike/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request params" });
  } else {
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
    );
    const commentData = await client.get(post_comment_key);
    if (commentData.bins.l_c > 0) {
      console.log("## LIKE COUNT IS GREATER THAN 0 ##");
      const commentMeta = await client.get(post_comment_meta_key);
      if (commentMeta.bins.dislikes.includes(req.user.handleUn)) {
        const removeLikeArr = [
          Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
        ];
        client.operate(
          post_comment_meta_key,
          removeLikeArr,
          async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const decrLikeCount = [Aerospike.operations.incr("l_c", -1)];
              client.operate(post_comment_key, decrLikeCount, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You remove your comment dislike" });
                }
              });
            }
          }
        );
      } else {
        if (
          commentMeta.bins.haha.includes(req.user.handleUn) ||
          commentMeta.bins.angry.includes(req.user.handleUn) ||
          commentMeta.bins.likes.includes(req.user.handleUn)
        ) {
          const ops = [
            Aerospike.lists.removeByValue("haha", req.user.handleUn),
            Aerospike.lists.removeByValue("angry", req.user.handleUn),
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
          client.operate(post_comment_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [
                Aerospike.lists.append("dislikes", req.user.handleUn),
              ];
              client.operate(
                post_comment_meta_key,
                ops,
                async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    if (commentData.bins.c_u_du !== req.user.handleUn) {
                      const map_key = new Aerospike.Key(
                        process.env.CLUSTER_NAME,
                        process.env.SET_APP_HISTORY,
                        commentData.bins.c_u_du
                      );
                      const notificationData = {
                        id: commentData.bins.postId,
                        ty: 4,
                        vi: false,
                        wo: req.user.handleUn,
                        ti: Date.now(),
                        nm: `${req.user.fn} ${req.user.ln}`,
                        pi: req.user.p_i,
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
                      let result = await client.operate(map_key, map_ops);
                      return res
                        .status(200)
                        .json({ msg: "Comment liked", notificationData });
                    } else {
                      return res.status(200).json({ msg: "Comment disliked" });
                    }
                  }
                }
              );
            }
          });
        } else {
          const appendLikeArr = [
            Aerospike.lists.append("likes", req.user.handleUn),
          ];
          client.operate(
            post_comment_meta_key,
            appendLikeArr,
            async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: error.message });
              } else {
                const incrLike = [Aerospike.operations.incr("l_c", 1)];
                client.operate(
                  post_comment_key,
                  incrLike,
                  async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // *** Notification send
                      if (commentData.bins.c_u_du !== req.user.handleUn) {
                        const map_key = new Aerospike.Key(
                          process.env.CLUSTER_NAME,
                          process.env.SET_APP_HISTORY,
                          commentData.bins.c_u_du
                        );
                        const notificationData = {
                          id: commentData.bins.postId,
                          ty: 4,
                          vi: false,
                          wo: req.user.handleUn,
                          ti: Date.now(),
                          nm: `${req.user.fn} ${req.user.ln}`,
                          pi: req.user.p_i,
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
                        let result = await client.operate(map_key, map_ops);
                        return res
                          .status(200)
                          .json({ msg: "Comment liked", notificationData });
                      } else {
                        return res.status(200).json({ msg: "Comment liked" });
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    } else {
      console.log("## LIKE COUNT IS 0 ##");
      const appendLikeArr = [
        Aerospike.lists.append("dislikes", req.user.handleUn),
      ];
      client.operate(
        post_comment_meta_key,
        appendLikeArr,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: error.message });
          } else {
            const incrLike = [Aerospike.operations.incr("l_c", 1)];
            client.operate(post_comment_key, incrLike, async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                // *** Notification send
                if (commentData.bins.c_u_du !== req.user.handleUn) {
                  const map_key = new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_APP_HISTORY,
                    commentData.bins.c_u_du
                  );
                  const notificationData = {
                    id: commentData.bins.postId,
                    ty: 4,
                    vi: false,
                    wo: req.user.handleUn,
                    ti: Date.now(),
                    nm: `${req.user.fn} ${req.user.ln}`,
                    pi: req.user.p_i,
                    cat: 2,
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
                  return res
                    .status(200)
                    .json({ msg: "Comment liked", notificationData });
                } else {
                  return res.status(200).json({ msg: "Comment disliked" });
                }
              }
            });
          }
        }
      );
    }
  }
});

// *** HAha
router.put("/comment/haha/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request params" });
  } else {
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
    );
    const commentData = await client.get(post_comment_key);
    if (commentData.bins.l_c > 0) {
      console.log("## LIKE COUNT IS GREATER THAN 0 ##");
      const commentMeta = await client.get(post_comment_meta_key);
      if (commentMeta.bins.haha.includes(req.user.handleUn)) {
        const removeLikeArr = [
          Aerospike.lists.removeByValue("haha", req.user.handleUn),
        ];
        client.operate(
          post_comment_meta_key,
          removeLikeArr,
          async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const decrLikeCount = [Aerospike.operations.incr("l_c", -1)];
              client.operate(post_comment_key, decrLikeCount, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You remove your comment haha" });
                }
              });
            }
          }
        );
      } else {
        if (
          commentMeta.bins.dislikes.includes(req.user.handleUn) ||
          commentMeta.bins.angry.includes(req.user.handleUn) ||
          commentMeta.bins.likes.includes(req.user.handleUn)
        ) {
          const ops = [
            Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
            Aerospike.lists.removeByValue("angry", req.user.handleUn),
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
          client.operate(post_comment_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("haha", req.user.handleUn)];
              client.operate(
                post_comment_meta_key,
                ops,
                async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    if (commentData.bins.c_u_du !== req.user.handleUn) {
                      const map_key = new Aerospike.Key(
                        process.env.CLUSTER_NAME,
                        process.env.SET_APP_HISTORY,
                        commentData.bins.c_u_du
                      );
                      const notificationData = {
                        id: commentData.bins.postId,
                        ty: 4,
                        vi: false,
                        wo: req.user.handleUn,
                        ti: Date.now(),
                        nm: `${req.user.fn} ${req.user.ln}`,
                        pi: req.user.p_i,
                        cat: 3,
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
                      let result = await client.operate(map_key, map_ops);
                      return res
                        .status(200)
                        .json({ msg: "Comment liked", notificationData });
                    } else {
                      return res.status(200).json({ msg: "Comment haha" });
                    }
                  }
                }
              );
            }
          });
        } else {
          const appendLikeArr = [
            Aerospike.lists.append("haha", req.user.handleUn),
          ];
          client.operate(
            post_comment_meta_key,
            appendLikeArr,
            async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: error.message });
              } else {
                const incrLike = [Aerospike.operations.incr("l_c", 1)];
                client.operate(
                  post_comment_key,
                  incrLike,
                  async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // *** Notification send
                      if (commentData.bins.c_u_du !== req.user.handleUn) {
                        const map_key = new Aerospike.Key(
                          process.env.CLUSTER_NAME,
                          process.env.SET_APP_HISTORY,
                          commentData.bins.c_u_du
                        );
                        const notificationData = {
                          id: commentData.bins.postId,
                          ty: 4,
                          vi: false,
                          wo: req.user.handleUn,
                          ti: Date.now(),
                          nm: `${req.user.fn} ${req.user.ln}`,
                          pi: req.user.p_i,
                          cat: 3,
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
                        let result = await client.operate(map_key, map_ops);
                        return res
                          .status(200)
                          .json({ msg: "Comment liked", notificationData });
                      } else {
                        return res.status(200).json({ msg: "Comment liked" });
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    } else {
      console.log("## LIKE COUNT IS 0 ##");
      const appendLikeArr = [Aerospike.lists.append("haha", req.user.handleUn)];
      client.operate(
        post_comment_meta_key,
        appendLikeArr,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: error.message });
          } else {
            const incrLike = [Aerospike.operations.incr("l_c", 1)];
            client.operate(post_comment_key, incrLike, async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                // *** Notification send
                if (commentData.bins.c_u_du !== req.user.handleUn) {
                  const map_key = new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_APP_HISTORY,
                    commentData.bins.c_u_du
                  );
                  const notificationData = {
                    id: commentData.bins.postId,
                    ty: 4,
                    vi: false,
                    wo: req.user.handleUn,
                    ti: Date.now(),
                    nm: `${req.user.fn} ${req.user.ln}`,
                    pi: req.user.p_i,
                    cat: 3,
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
                  return res
                    .status(200)
                    .json({ msg: "Comment haha", notificationData });
                } else {
                  return res.status(200).json({ msg: "Comment haha" });
                }
              }
            });
          }
        }
      );
    }
  }
});

// *** Angry
router.put("/comment/angry/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request params" });
  } else {
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
    );
    const commentData = await client.get(post_comment_key);
    if (commentData.bins.l_c > 0) {
      console.log("## LIKE COUNT IS GREATER THAN 0 ##");
      const commentMeta = await client.get(post_comment_meta_key);
      if (commentMeta.bins.haha.includes(req.user.handleUn)) {
        const removeLikeArr = [
          Aerospike.lists.removeByValue("angry", req.user.handleUn),
        ];
        client.operate(
          post_comment_meta_key,
          removeLikeArr,
          async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const decrLikeCount = [Aerospike.operations.incr("l_c", -1)];
              client.operate(post_comment_key, decrLikeCount, (err, result) => {
                if (err) {
                  return res.status(400).json({ msg: err.message });
                } else {
                  return res
                    .status(200)
                    .json({ msg: "You remove your comment angry" });
                }
              });
            }
          }
        );
      } else {
        if (
          commentMeta.bins.dislikes.includes(req.user.handleUn) ||
          commentMeta.bins.haha.includes(req.user.handleUn) ||
          commentMeta.bins.likes.includes(req.user.handleUn)
        ) {
          const ops = [
            Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
            Aerospike.lists.removeByValue("haha", req.user.handleUn),
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
          client.operate(post_comment_meta_key, ops, (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              const ops = [Aerospike.lists.append("angry", req.user.handleUn)];
              client.operate(
                post_comment_meta_key,
                ops,
                async (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err.message });
                  } else {
                    if (commentData.bins.c_u_du !== req.user.handleUn) {
                      const map_key = new Aerospike.Key(
                        process.env.CLUSTER_NAME,
                        process.env.SET_APP_HISTORY,
                        commentData.bins.c_u_du
                      );
                      const notificationData = {
                        id: commentData.bins.postId,
                        ty: 4,
                        vi: false,
                        wo: req.user.handleUn,
                        ti: Date.now(),
                        nm: `${req.user.fn} ${req.user.ln}`,
                        pi: req.user.p_i,
                        cat: 4,
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
                      let result = await client.operate(map_key, map_ops);
                      return res
                        .status(200)
                        .json({ msg: "Comment angry", notificationData });
                    } else {
                      return res.status(200).json({ msg: "Comment angry" });
                    }
                  }
                }
              );
            }
          });
        } else {
          const appendLikeArr = [
            Aerospike.lists.append("haha", req.user.handleUn),
          ];
          client.operate(
            post_comment_meta_key,
            appendLikeArr,
            async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: error.message });
              } else {
                const incrLike = [Aerospike.operations.incr("l_c", 1)];
                client.operate(
                  post_comment_key,
                  incrLike,
                  async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      // *** Notification send
                      if (commentData.bins.c_u_du !== req.user.handleUn) {
                        const map_key = new Aerospike.Key(
                          process.env.CLUSTER_NAME,
                          process.env.SET_APP_HISTORY,
                          commentData.bins.c_u_du
                        );
                        const notificationData = {
                          id: commentData.bins.postId,
                          ty: 4,
                          vi: false,
                          wo: req.user.handleUn,
                          ti: Date.now(),
                          nm: `${req.user.fn} ${req.user.ln}`,
                          pi: req.user.p_i,
                          cat: 4,
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
                        let result = await client.operate(map_key, map_ops);
                        return res
                          .status(200)
                          .json({ msg: "Comment liked", notificationData });
                      } else {
                        return res.status(200).json({ msg: "Comment liked" });
                      }
                    }
                  }
                );
              }
            }
          );
        }
      }
    } else {
      console.log("## LIKE COUNT IS 0 ##");
      const appendLikeArr = [
        Aerospike.lists.append("angry", req.user.handleUn),
      ];
      client.operate(
        post_comment_meta_key,
        appendLikeArr,
        async (err, result) => {
          if (err) {
            return res.status(400).json({ msg: error.message });
          } else {
            const incrLike = [Aerospike.operations.incr("l_c", 1)];
            client.operate(post_comment_key, incrLike, async (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                // *** Notification send
                if (commentData.bins.c_u_du !== req.user.handleUn) {
                  const map_key = new Aerospike.Key(
                    process.env.CLUSTER_NAME,
                    process.env.SET_APP_HISTORY,
                    commentData.bins.c_u_du
                  );
                  const notificationData = {
                    id: commentData.bins.postId,
                    ty: 4,
                    vi: false,
                    wo: req.user.handleUn,
                    ti: Date.now(),
                    nm: `${req.user.fn} ${req.user.ln}`,
                    pi: req.user.p_i,
                    cat: 4,
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
                  return res
                    .status(200)
                    .json({ msg: "Comment angry", notificationData });
                } else {
                  return res.status(200).json({ msg: "Comment angry" });
                }
              }
            });
          }
        }
      );
    }
  }
});

// Spam post comment
router.put("/comment/spam/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
    );

    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var data;

    stream.on("data", function (record) {
      data = record.bins;
    });
    stream.on("end", function (record) {
      if (data.spam.includes(req.user.handleUn)) {
        const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
        client.operate(post_comment_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("s_c", -1)];
            client.operate(post_comment_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Comment spam removed" });
              }
            });
          }
        });
      } else {
        const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
        client.operate(post_comment_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("s_c", 1)];
            client.operate(post_comment_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Comment spam" });
              }
            });
          }
        });
      }
    });
  }
});

router.put("/comment/:type/:id/:username/:likeCount", async (req, res) => {
  if (!req.params.id || !req.params.username || !req.params.type) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    console.log(req.params.type);
    var batchRecords = [];
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
    );

    let batchPolicy1 = new Aerospike.BatchPolicy({});
    var batchArrKeys = [post_comment_key, post_comment_meta_key];

    const commentData = await client.get(post_comment_key);
    const commentMetaData = await client.get(post_comment_meta_key);

    var commentOps;
    var commentMetaOps;

    if (req.params.type === "like") {
      console.log("## LIKE ##");
      if (commentData.bins.l_c > 0) {
        if (commentMetaData.bins.likes.includes(req.user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("likes", req.user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("likes", req.user.handleUn)];
      }
    } else if (req.params.type === "dislike") {
      if (commentData.bins.l_c > 0) {
        if (commentMetaData.bins.dislikes.includes(req.user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [
            Aerospike.lists.append("dislikes", req.user.handleUn),
          ];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [
          Aerospike.lists.append("dislikes", req.user.handleUn),
        ];
      }
    } else if (req.params.type === "haha") {
      console.log("## HAHA ##");
      if (Number(req.params.likeCount) > 0) {
        if (commentMetaData.bins.haha.includes(req.user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("haha", req.user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("haha", req.user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("haha", req.user.handleUn)];
      }
    } else if (req.params.type === "angry") {
      if (Number(req.params.likeCount) > 0) {
        if (commentMetaData.bins.haha.includes(req.user.handleUn)) {
          commentOps = [Aerospike.operations.incr("l_c", -1)];
          commentMetaOps = [
            Aerospike.lists.removeByValue("angry", req.user.handleUn),
          ];
        } else {
          commentOps = [Aerospike.operations.incr("l_c", 1)];
          commentMetaOps = [Aerospike.lists.append("angry", req.user.handleUn)];
        }
      } else {
        commentOps = [Aerospike.operations.incr("l_c", 1)];
        commentMetaOps = [Aerospike.lists.append("angry", req.user.handleUn)];
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
      if (req.params.username !== req.user.handleUn) {
        const map_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_APP_HISTORY,
          req.params.username
        );
        const notificationData = {
          id: commentData.bins.postId,
          ty: 4,
          vi: false,
          wo: req.user.handleUn,
          ti: Date.now(),
          nm: `${req.user.fn} ${req.user.ln}`,
          pi: req.user.p_i,
          cat: 4,
          re: req.params.username,
        };
        const map_ops = [
          Aerospike.operations.write("n_id", req.params.username),
          Aerospike.maps.put("notification", Date.now(), notificationData, {
            order: maps.order.KEY_ORDERED,
          }),
          Aerospike.operations.incr("count", 1),
        ];
        let result = await client.operate(map_key, map_ops);
        return res.status(200).json({
          msg: `You reacted ${req.params.type} on this comment`,
          notificationData,
        });
      } else {
        return res
          .status(200)
          .json({ msg: `You reacted ${req.params.type} on this comment` });
      }
    } catch (error) {
      return res.status(400).json({ msg: "Something went wrong" });
    }
  }
});

router.post("/comment/like/remove/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid parameter" });
  } else {
    var batchRecords = [];
    const batchType = Aerospike.batchType;
    const client = await getAerospikeClient();
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
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
            Aerospike.lists.removeByValue("likes", req.user.handleUn),
            Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
            Aerospike.lists.removeByValue("haha", req.user.handleUn),
            Aerospike.lists.removeByValue("angry", req.user.handleUn),
          ],
        });
      }
    }

    await client.batchWrite(batchRecords, batchPolicy1);
    try {
      return res.status(200).json({ msg: "Emoji reaction remove" });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
});

// **** Fetch comment replies **** //
// post_comment_reply
router.post("/comment/reply/:id", async (req, res) => {
  const reply_id = now.micro();
  const client = await getAerospikeClient();
  const batchType = Aerospike.batchType;
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    // *** Comment reply key
    const post_comment_reply_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      reply_id
    );

    // *** Comment reply key meta
    const post_comment_reply_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      reply_id
    );

    // *** Create post comment key
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT,
      req.params.id
    );

    // *** Create post meta comment key
    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_COMMENT_META,
      req.params.id
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
            Aerospike.operations.write("content", req.body.text), // content
            Aerospike.operations.write("l_c", 0), // like count
            Aerospike.operations.write("d_c", 0), // dislike count
            Aerospike.operations.write("s_c", 0), // spam count
            Aerospike.operations.write("r_u_fn", req.user.fn), // user first name
            Aerospike.operations.write("r_u_ln", req.user.ln), // user last name
            Aerospike.operations.write("r_u_dun", req.user.handleUn), // user handle username
            Aerospike.operations.write("r_u_pic", req.user.p_i), // user profile picture
            Aerospike.operations.write("cmntId", req.params.id), // comment id (index)
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
        if (commentData.bins.c_u_du !== req.user.handleUn) {
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
            wo: req.user.handleUn,
            ti: Date.now(),
            nm: `${req.user.fn} ${req.user.ln}`,
            pi: req.user.p_i,
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
          return res.status(200).json({ reply: data.bins, notificationData });
        } else {
          return res.status(400).json({ reply: data.bins });
        }
      } catch (error) {
        return res.status(400).json({ msg: error.message });
      }
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
});

// *** Fetch replies
router.get("/comment/reply/:id", async (req, res) => {
  const client = await getAerospikeClient();
  const batchType = Aerospike.batchType;
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid" });
  } else {
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("cmntId", req.params.id));
    const stream = query.foreach();
    const arr = [];
    stream.on("data", function (record) {
      console.log(record.bins.cmntId, req.params.id);
      arr.push(record.bins);
    });

    stream.on("end", function (record) {
      // console.log(arr);
      const page = req.query.page;
      const limit = req.query.limit;
      const sortedBy = req.query.sortedBy;
      var start = (page - 1) * limit;
      var end = page * limit;
      // var temp = arr.sort((a, b) => a.id - b.id)
      var data = arr.slice(start, end);
      return res.status(200).json(arr);
    });
  }
});

// **** Hide comment replies **** //
router.put("/comment/reply/spam/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_reply_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      req.params.id
    );

    const post_comment_reply_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      req.params.id
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
    stream.on("end", function (record) {
      if (data.spam.includes(req.user.handleUn)) {
        const ops = [Aerospike.lists.removeByValue("spam", req.user.handleUn)];
        client.operate(post_comment_reply_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("s_c", -1)];
            client.operate(post_comment_reply_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Reply spam removed" });
              }
            });
          }
        });
      } else {
        const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
        client.operate(post_comment_reply_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("s_c", 1)];
            client.operate(post_comment_reply_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Reply spam" });
              }
            });
          }
        });
      }
    });
  }
});

router.put("/comment/reply/delete/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_reply_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      req.params.id
    );
    let query = client.query(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY
    );
    const tempBin1 = "ExpVar";
    query.where(Aerospike.filter.equal("id", req.params.id));
    const stream = query.foreach();
    var data;

    stream.on("data", function (record) {
      data = record.bins;
    });
    stream.on("end", function (record) {
      if (!data.delete) {
        const ops = [Aerospike.operations.write("delete", true)];

        client.operate(post_reply_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const post_comment_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_POST_COMMENT,
              data.cmntId
            );
            const ops = [Aerospike.operations.incr("reply_c", -1)];
            client.operate(post_comment_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Comment deleted" });
              }
            });
          }
        });
      }
    });
  }
});

router.put("/comment/reply/dislike/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    const post_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      req.params.id
    );

    const post_comment_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      req.params.id
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

    stream.on("end", function (record) {
      console.log(data);
    });
  }
});

router.put("/comment/reply/like/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    // const post_comment_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_POST_COMMENT,
    //   req.params.id
    // );

    const reply_comment_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY,
      req.params.id
    );

    const reply_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POST_REPLY_META,
      req.params.id
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
      if (replyMeta.bins.likes.includes(req.user.handleUn)) {
        const listOps = [
          Aerospike.lists.removeByValue("likes", req.user.handleUn),
        ];
        client.operate(reply_meta_key, listOps, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            // reply_comment_key
            const decLike = [Aerospike.operations.incr("l_c", -1)];
            client.operate(reply_comment_key, decLike, (err, ops) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                return res.status(200).json({ msg: "Like removed" });
              }
            });
          }
        });
      } else {
        const listOps1 = [
          Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
        ];
        client.operate(reply_meta_key, listOps1, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const countDec = [Aerospike.operations.incr("d_c", -1)];
            client.operate(reply_comment_key, countDec, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const listOps2 = [
                  Aerospike.lists.append("likes", req.user.handleUn),
                ];
                client.operate(
                  reply_meta_key,
                  listOps2,
                  async (err, result) => {
                    if (err) {
                      return res.status(400).json({ msg: err.message });
                    } else {
                      const incrLike = [Aerospike.operations.incr("l_c", 1)];
                      client.operate(
                        reply_comment_key,
                        incrLike,
                        async (err, result) => {
                          if (err) {
                            return res.status(400).json({ msg: err.message });
                          } else {
                            if (commentData.bins.c_u_du === req.user.handleUn) {
                              return res
                                .status(200)
                                .json({ msg: "I liked my reply" });
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
                                wo: req.user.handleUn,
                                ti: Date.now(),
                                nm: `${req.user.fn} ${req.user.ln}`,
                                pi: req.user.p_i,
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
                              return res.status(200).json({
                                msg: "You like this reply",
                                notificationData,
                              });
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
      const listOps = [Aerospike.lists.append("likes", req.user.handleUn)];
      client.operate(reply_meta_key, listOps, (err, result) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          const ops = [Aerospike.operations.incr("l_c", 1)];
          client.operate(reply_comment_key, ops, async (err, result) => {
            if (err) {
              return res.status(400).json({ msg: err.message });
            } else {
              if (reply.bins.cmntId === req.user.handleUn) {
                return res.status(200).json({ msg: "I liked my reply" });
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
                  wo: req.user.handleUn,
                  ti: Date.now(),
                  nm: `${req.user.fn} ${req.user.ln}`,
                  pi: req.user.p_i,
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
                return res.status(200).json({
                  msg: "You like this reply",
                  notificationData,
                });
              }
            }
          });
        }
      });
    }
  }
});

// ****
router.get("/fetch/crypto", async (req, res) => {
  const client = await getAerospikeClient();
  let query = client.query(process.env.CLUSTER_NAME, "crypto_list");
  const tempBin1 = "ExpVar";
  const stream = query.foreach();
  var temp = [];

  stream.on("data", function (record) {
    temp.push({
      id: record.bins.id,
      display: `${record.bins.name}-${record.bins.price}`,
    });
  });
  stream.on("end", function (record) {
    return res.status(200).json(temp);
  });
});

module.exports = router;
