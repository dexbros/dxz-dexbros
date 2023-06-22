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
// const { kafka } = require("kafkajs");
// const producer = kafka.producer();

// *****
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-social-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 75 * 1024 * 1024,
  },
});
const {
  createNewPost,
  pinnedPost,
  bookmarkPost,
  hidePost,
  fetchPostAnalytics,
  postEdit,
  deletePost,
  spamPost,
  fetchNews,
  fetchFeedPost,
  fetchForYouFeedPost,
  fetchUserRelatedPosts,
  fetchTrendingWords,
  fetchTrendingPosts,
  donateNft,
  fetchDonationHistory,
  fetchSingleDonationDetails,
  createNft,
  sharePost,
  sharePostPrivacy,
  commentPostPrivacy,
  emojiLikePost,
  emojiDislikePost,
  emojiHahaPost,
  emojiAngryPost,
  fetchLikedUsers,
  postHelpfulInfo,
  unHelpfulInfo,
  misleadingInfo,
  likeAnnouncement,
  importentAnnouncement,
  scamAnnouncement,
  reliableNews,
  interstingNew,
  fakeNews,
  searchPost,
  repostPost,
  fetchPostToCreatNft,
  fetchFullPost,
  createComment,
  fetchsingleComment,
  fetchMyComments,
  pinnedComment,
  deleteComment,
  editComment,
  commentDislike,
  commentHaha,
  commentAngry,
  spamComment,
  commentLikeRemove,
  createReply,
  hideReply,
  fetchReplies,
  spamReply,
  deleteReply,
  dislikeReply,
  likeReply,
  commentLike,
  fetchFullPostWithComment,
  updateViewCount,
} = require("../../../controller/postController");

/**
 * START
 */

// *** Update post count
router.post("/update/view/count", updateViewCount);

// *** Create new post
router.post("/create", multer.single("image"), createNewPost);
router.get("/fetch/full/post/:id", fetchFullPostWithComment);

// *** Pinned Post
router.put("/pinned/:id", pinnedPost);

// *** Bookmark post
router.put("/bookmark/:id", bookmarkPost);

// *** Hide post
router.put("/hide/:id", hidePost);

// *** Fetch post analytics
router.get("/fetch/post/analytics/:id", fetchPostAnalytics);

// *** Post Edit
router.put("/edit/:id", postEdit);

// *** Post delete
router.delete("/delete/:id", deletePost);

// *** Post spam
router.put("/spam/:id", spamPost);

// **** Fetch news
router.get("/fetch/news", fetchNews);

// *** Fetch all posts
router.get("/feed/all", fetchFeedPost);

// *** All feed
router.get("/feed/for_you", fetchForYouFeedPost);

// *** Fetch user related posts
router.get("/user/post/:handleUn", fetchUserRelatedPosts);

// *** Fetch all trending key words
router.get("/trending/list", fetchTrendingWords);

// *** fetch all trending posts
router.get("/trending/posts", fetchTrendingPosts);

// *** Donate nft to the user
router.post("/donate/:id", donateNft);

// *** Fetch donation history
router.get("/fetch/donate/history/:id", fetchDonationHistory);

// *** Fetch single donation details
router.get("/fetch/single/details/:id", fetchSingleDonationDetails);

// *** Create and save nft images
router.post("/create/nft", createNft);

// *** share social posts
router.post("/share/post/:id", sharePost);

// *** share social posts
router.put("/share/post/privacy/:id", sharePostPrivacy);

// *** share social posts
router.put("/comment/post/privacy/:id", commentPostPrivacy);

// *** Social post emoji like
router.put("/emoji/like/:id", emojiLikePost);

// *** Social post emoji dislike
router.put("/emoji/dislike/:id", emojiDislikePost);

// *** Social post emoji haha
router.put("/emoji/haha/:id", emojiHahaPost);

// *** Social emoji Angry post
router.put("/emoji/angry/:id", emojiAngryPost);

// *** Fetch all users who like the post
router.get("/like/users/:id", fetchLikedUsers);

// *** Helpfull Information post
router.post("/helpfull/:id", postHelpfulInfo);

// *** Unhelpfull Information post
router.post("/unhelpfull/:id", unHelpfulInfo);

// *** Misleading Information post
router.post("/misleading/:id", misleadingInfo);

// *** Like announcement
router.post("/like/:id", likeAnnouncement);

// *** Importent announcement
router.post("/impotent/:id", importentAnnouncement);

// *** Scam announcemnt
router.post("/scam/:id", scamAnnouncement);

// *** Reliable news
router.post("/reliable/:id", reliableNews);

// *** Interesting news
router.post("/interesting/:id", interstingNew);

// *** Fake news
router.post("/fake/:id", fakeNews);

// *** Search post
router.get("/search/post", searchPost);

// **** Share post
router.post("/repost/status/:id", repostPost);

// *** Fetch post for creating NFT
router.get("/fetch/nft/post/:id", fetchPostToCreatNft);

// *** Fetch full post
router.get("/full/:id", fetchFullPost);

/***
 * @SOCIAL_POST_COMMENT
 */

// *** Create post comment
router.post("/comment/:id", multer.single("c_img"), createComment);

// *** Fetch single comment
router.get("/comment/:id", fetchsingleComment);

// *** Fetch user comment
router.get("/my_comment/:id", fetchMyComments);

// *** Pinned comment
router.put("/comment/pinned/:id", pinnedComment);

// *** Comment delete
router.put("/comment/delete/:id", deleteComment);

// *** Comment Edit
router.put("/comment/edit/:id", editComment);

// Comment dislike
router.put("/comment/dislike/:id", commentDislike);

// *** Comment hhaha
router.put("/comment/haha/:id", commentHaha);

// *** Comment angry
router.put("/comment/angry/:id", commentAngry);

// Spam post comment
router.put("/comment/spam/:id", spamComment);

// *** Comment like removed
router.put("/comment/like/remove/:id", commentLikeRemove);

/**
 * @POST_COMMENT_REPLY
 */

// *** create comment reply
router.post("/comment/reply/:id", createReply);

// *** Fetch replies
router.get("/comment/reply/:id", fetchReplies);

router.put("/comment/reply/spam/:id", spamReply);

// *** Delete reply
router.put("/comment/reply/delete/:id", deleteReply);

router.put("/comment/reply/dislike/:id", dislikeReply);

router.put("/comment/reply/like/:id", likeReply);

/**
 * END
 */

// router.get("/:id", async (req, res, next) => {
//   const postId = req.params.id;
//   const client = await getAerospikeClient();
//   if (!postId) {
//     return res.status(401).json({ msg: "Invalid request" });
//   } else {
//     var post_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POSTS,
//       postId
//     );
//     client
//       .exists(post_key)
//       .then(async (data) => {
//         // console.log(data);
//         if (data) {
//           var data = await client.get(post_key);

//           try {
//             console.log(data.bins);
//             return res.status(200).json(data.bins);
//           } catch (err) {
//             return res.status(401).json({ msg: err.message });
//           }
//         }
//       })
//       .catch((err) => {
//         return res.status(401).json({ msg: err.message });
//       });
//   }
// });

/******
 * 









 */

router.put("/comment/:type/:id/:username/:likeCount", commentLike);

// router.put("/comment/reply/like/:id", async (req, res) => {
//   const client = await getAerospikeClient();
//   if (!req.params.id) {
//     return res.status(401).json({ msg: "Invalid request" });
//   } else {
//     // const post_comment_key = new Aerospike.Key(
//     //   process.env.CLUSTER_NAME,
//     //   process.env.SET_POST_COMMENT,
//     //   req.params.id
//     // );

//     const reply_comment_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POST_REPLY,
//       req.params.id
//     );

//     const reply_meta_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POST_REPLY_META,
//       req.params.id
//     );

//     const reply = await client.get(reply_comment_key);
//     console.log(reply.bins);

//     const comment_key = new Aerospike.Key(
//       process.env.CLUSTER_NAME,
//       process.env.SET_POST_COMMENT,
//       reply.bins.cmntId
//     );

//     const commentData = await client.get(comment_key);

//     const replyMeta = await client.get(reply_meta_key);
//     if (reply.bins.l_c > 0) {
//       if (replyMeta.bins.likes.includes(req.user.handleUn)) {
//         const listOps = [
//           Aerospike.lists.removeByValue("likes", req.user.handleUn),
//         ];
//         client.operate(reply_meta_key, listOps, (err, result) => {
//           if (err) {
//             return res.status(400).json({ msg: err.message });
//           } else {
//             // reply_comment_key
//             const decLike = [Aerospike.operations.incr("l_c", -1)];
//             client.operate(reply_comment_key, decLike, (err, ops) => {
//               if (err) {
//                 return res.status(400).json({ msg: err.message });
//               } else {
//                 return res.status(200).json({ msg: "Like removed" });
//               }
//             });
//           }
//         });
//       } else {
//         const listOps1 = [
//           Aerospike.lists.removeByValue("dislikes", req.user.handleUn),
//         ];
//         client.operate(reply_meta_key, listOps1, (err, result) => {
//           if (err) {
//             return res.status(400).json({ msg: err.message });
//           } else {
//             const countDec = [Aerospike.operations.incr("d_c", -1)];
//             client.operate(reply_comment_key, countDec, (err, result) => {
//               if (err) {
//                 return res.status(400).json({ msg: err.message });
//               } else {
//                 const listOps2 = [
//                   Aerospike.lists.append("likes", req.user.handleUn),
//                 ];
//                 client.operate(
//                   reply_meta_key,
//                   listOps2,
//                   async (err, result) => {
//                     if (err) {
//                       return res.status(400).json({ msg: err.message });
//                     } else {
//                       const incrLike = [Aerospike.operations.incr("l_c", 1)];
//                       client.operate(
//                         reply_comment_key,
//                         incrLike,
//                         async (err, result) => {
//                           if (err) {
//                             return res.status(400).json({ msg: err.message });
//                           } else {
//                             if (commentData.bins.c_u_du === req.user.handleUn) {
//                               return res
//                                 .status(200)
//                                 .json({ msg: "I liked my reply" });
//                             } else {
//                               // **** Reply like notification
//                               const map_key = new Aerospike.Key(
//                                 process.env.CLUSTER_NAME,
//                                 process.env.SET_APP_HISTORY,
//                                 commentData.bins.c_u_du
//                               );
//                               const notificationData = {
//                                 id: commentData.bins.c_u_du,
//                                 ty: 6,
//                                 vi: false,
//                                 wo: req.user.handleUn,
//                                 ti: Date.now(),
//                                 nm: `${req.user.fn} ${req.user.ln}`,
//                                 pi: req.user.p_i,
//                                 cat: 1,
//                                 re: commentData.bins.c_u_du,
//                               };
//                               const map_ops = [
//                                 Aerospike.operations.write(
//                                   "n_id",
//                                   commentData.bins.c_u_du
//                                 ),
//                                 Aerospike.maps.put(
//                                   "notification",
//                                   Date.now(),
//                                   notificationData,
//                                   {
//                                     order: maps.order.KEY_ORDERED,
//                                   }
//                                 ),
//                                 Aerospike.operations.incr("count", 1),
//                               ];
//                               let result = await client.operate(
//                                 map_key,
//                                 map_ops
//                               );
//                               return res.status(200).json({
//                                 msg: "You like this reply",
//                                 notificationData,
//                               });
//                             }
//                           }
//                         }
//                       );
//                     }
//                   }
//                 );
//               }
//             });
//           }
//         });
//       }
//     } else {
//       const listOps = [Aerospike.lists.append("likes", req.user.handleUn)];
//       client.operate(reply_meta_key, listOps, (err, result) => {
//         if (err) {
//           return res.status(400).json({ msg: err.message });
//         } else {
//           const ops = [Aerospike.operations.incr("l_c", 1)];
//           client.operate(reply_comment_key, ops, async (err, result) => {
//             if (err) {
//               return res.status(400).json({ msg: err.message });
//             } else {
//               if (reply.bins.cmntId === req.user.handleUn) {
//                 return res.status(200).json({ msg: "I liked my reply" });
//               } else {
//                 // **** Reply like notification
//                 const map_key = new Aerospike.Key(
//                   process.env.CLUSTER_NAME,
//                   process.env.SET_APP_HISTORY,
//                   commentData.bins.c_u_du
//                 );
//                 const notificationData = {
//                   id: commentData.bins.c_u_du,
//                   ty: 6,
//                   vi: false,
//                   wo: req.user.handleUn,
//                   ti: Date.now(),
//                   nm: `${req.user.fn} ${req.user.ln}`,
//                   pi: req.user.p_i,
//                   cat: 1,
//                   re: commentData.bins.c_u_du,
//                 };
//                 const map_ops = [
//                   Aerospike.operations.write("n_id", commentData.bins.c_u_du),
//                   Aerospike.maps.put(
//                     "notification",
//                     Date.now(),
//                     notificationData,
//                     {
//                       order: maps.order.KEY_ORDERED,
//                     }
//                   ),
//                   Aerospike.operations.incr("count", 1),
//                 ];
//                 let result = await client.operate(map_key, map_ops);
//                 return res.status(200).json({
//                   msg: "You like this reply",
//                   notificationData,
//                 });
//               }
//             }
//           });
//         }
//       });
//     }
//   }
// });

// ****
// router.get("/fetch/crypto", async (req, res) => {
//   const client = await getAerospikeClient();
//   let query = client.query(process.env.CLUSTER_NAME, "crypto_list");
//   const tempBin1 = "ExpVar";
//   const stream = query.foreach();
//   var temp = [];

//   stream.on("data", function (record) {
//     temp.push({
//       id: record.bins.id,
//       display: `${record.bins.name}-${record.bins.price}`,
//     });
//   });
//   stream.on("end", function (record) {
//     return res.status(200).json(temp);
//   });
// });

module.exports = router;
