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
const { getAerospikeClient } = require("../../../../aerospike");
const maps = Aerospike.maps;
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");

// const storage = new Storage({
//   projectId: "quiztasy",
//   credentials: {
//     client_email: "dexbros-upload@quiztasy.iam.gserviceaccount.com",
//     private_key:
//       "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxtcYo4lgaK7gh\nV1z3UFRkV2HT28rUjuFKrQrfjEEKkzgZWgwu8V6SzPXPYmGWAFpLtYqgUP28QXoq\nXWCWLYlMcQA2OalnjNiilRy8Yq2Yjj75LPy2rKT8W14Cyr07inZxEWsrs5rS3Ycp\nw3nZnub5dxPXqewrjHPQUx0a5a6UiBDD7YdE1fHAniaxZz18yy9f6nOVWac0m5P2\ntHNgrB+CalwQIf51TCvJrfsPw0hFHHYlTWhA8ATZfPJxAXNLklo/roFr/LmfUnq0\nl1nFPQqTMj5jCOQ8DO5j0zFJvgZ/d0ePN0IOyUxhVH9Qq9oQRh7YqdDcr27Vos4H\nmXkoA36JAgMBAAECggEARyDBUqXdq4PqK/YisJ5HWO4cqsZjNZaGl/QQ0Q77DXeF\nUahYDgXv24QLstjmxDoZ6gmclbQ1Cr+OXRyIxzMsrBrigdGse1TFdLWIDeLVJqVw\nkR0vfRI26wbK5wUsnoM6CuF06sX1ZwbhzZZ+09qlCh5eI8jQTVHnHO/XS2e465uq\nIxMWwGBEy5ZVksWV+/OA+YvQMSMxar0AMvCTf2McoUGw/flxXrg4gnl/brI7p4El\nokYb6MVI38VvlQ87MshosDA4bxSj0IyHXzXHC3vJ4E1Ph1CjbHjtV4YVlLy0qH3K\n41UOEa5OPNSG5rvPAz/oQDjyFw2nuDVGpKRlqGteTQKBgQDy3xvXN7jyVr74r42V\n8H2BtyachzYtESrpLnoM4bHEZ3hzjnGrLSQUMFBleajcs+yCqcvzruW7mG5SNYNU\na7NrzncnGC1SOX5ej4oOOW8/K/cYbpqDP6f3NkKh7Xkb+xcbwuPvB+Sbl1sUNRfB\nyY5iVjr3x7GBo0g62AN52/+bvwKBgQC7UPOX/VoAmIpKXfzR9RX43/JsqIJ9WZdY\nK0ToMwskV2bN71T2u0D0/ryh6R7MeyIF5PgAZSyTFXLrlwm/GFzBXgew/4Hiud0g\n4W/h7UXpCDOWGq/Cik2VbshsCvDiJr05Q9SYEVyOj6702ZkEHNc5p1Jgao4xYKSV\nD3yZqfMXtwKBgAvG+eij0RofTr9sc+czdEKYCQ1KGTxyOqx4Dn8VarNleRfRbn2o\ngLlh5mQlVCTvrKZhaXx1nLpOF/twkN/FITw3FNwWdgwosZIQT9eEvXpIvYC3zFJV\nAeYhAXYst9S9hk9YUglDTrikzEvcjzxcc8Uc/VsKmfb5XgVMeE6udmStAoGAe+4z\nPHwC8CH8XPeSLddZki+Y1QsoSobb+xmlnXsoBANPoTCXpiZ985oWc4kpN2DAQeYb\nrydBNo8aWYS0jhowRD9SF2j1JmySQQ7mVzQE7QjgGI/PeYbHjfad493ZQccfqqOW\nJIZYFno55wWQl4f9Xce2WNQm/8RRH83/QiuPCkECgYEAz9WgZuz9tOF2Nl3qkW4I\naW7ViTE8XiFHMFZIh5LXyER98YUxVVRdNBOJtvlop6KXAIN9g8VzrOHvT34jd057\nEwAO4HDmE71PsdqrwgMCJEYGHhkv/ZXU2Hey0bqV0/ajvkcVN5mHm81j68fdqzB0\niBUDWp6KQ0+9BYstzxlNdbw=\n-----END PRIVATE KEY-----\n",
//   },
// });
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
});
// const bucket = storage.bucket("dexbros_files");

/**
 * @START
 */
const {
  createPostLike,
  viewFullPost,
  handleDislike,
  handleHaha,
  handleAngry,
  fetchLikeUser,
  fetchPosts,
  fetchBlockFeed,
  fetchSinglePost,
  fetchFullPost,
  spamPost,
  bookmarkPost,
  repostPost,
  editPost,
  pinnedPost,
  deletePost,
  hideUnhidePost,
  createPost,
  donatePost,
  fetchAnalytics,
  createComment,
  fetchComments,
  fetchMyComments,
  likeComment,
  removeLike,
  reportComment,
  pinnedComment,
  editComment,
  deleteComment,
  hideComment,
  createReply,
  fetchReplies,
  hideCommentReply,
  deleteReply,
  likeReply,
  dislikeReply,
  spamReply,
  createEvent,
  fetchEvents,
  joinEvent,
  fetchEvent,
  deleteEvent,
  editReply,
  eventInterest,
  eventNotInterest,
  eventjoin,
  blockFeed,
} = require("../../../../controller/blockPostController");

router.get("/get_feed", blockFeed);

router.put("/like/:id", createPostLike);

router.get("/view/full/post/:id", viewFullPost);

router.put("/dislike/:id", handleDislike);

router.put("/haha/:id", handleHaha);

// *** Create angry emoji
router.put("/angry/:id", handleAngry);

router.get("/:id/liked_user", fetchLikeUser);

// fetch group posts
router.get("/:id", fetchPosts);

// fetch like user
router.get("/like/users/:id", fetchLikeUser);

// fetch block feed
router.get("/block/feed", fetchBlockFeed);

// Fetch single post
// router.get("/single/:id", fetchSinglePost);

// fetch full post
// router.get("/full-post/:id", fetchFullPost);

router.put("/spam/:id", spamPost);

// router.put("/bookmark/:id", bookmarkPost);

// Create Repost Post route
// router.post("/repost/:id", repostPost);

// Create Post Edit route
router.put("/edit/:id", editPost);

// Create Pinned Post route
router.put("/pinned/:id", pinnedPost);

// Create Delete Post route
router.put("/delete/:id", deletePost);

// POST HIDE & UNHIDE ROUTE
router.put("/hide/:id", hideUnhidePost);

// ******* CREATE GROUP POST API REDESIGN ******* //
router.post("/create/post/:id", multer.single("image"), createPost);

router.post("/donate/:id", donatePost);

router.get("/fetch/analytics/:id", fetchAnalytics);

//**************** GROUP POST COMMENT **************//
router.post("/comments/:id", multer.single("cmnt_img"), createComment);

router.get("/comments/:id", fetchComments);

router.get("/my_comments/:id", fetchMyComments);

router.put("/comment/:type/:id/:username/:likeCount", likeComment);

router.post("/comment/like/remove/:id", removeLike);

// router.put("/comment/spam/:id", reportComment);

// router.put("/comment/pinned/:id", pinnedComment);

// 6. Edit  comment
router.put("/comment/edit/:id", multer.single("img"), editComment);

// 7. Delete Comment
router.put("/comment/delete/:id", deleteComment);

// 8. Hide comment
router.put("/comment/hide/:id", hideComment);

// ******************* Replies ******************* //

// ******* CREATE GROUP COMMENT REPLY
router.post("/comment/reply/:id", createReply);

// *** Fetch all replies
router.get("/comment/reply/:id", fetchReplies);

// *** Group comment reply HIDE
router.put("/comment/reply/hide/:id", hideCommentReply);

router.put("/comment/reply/delete/:id", deleteReply);

router.put("/comment/reply/edit/:id", editReply);

// *** Group comment reply LIKE
router.put("/comment/reply/like/:id", likeReply);

router.put("/comment/reply/dislike/:id", dislikeReply);

router.put("/comment/reply/spam/:id", spamReply);

router.post("/event/create", multer.single("eventimage"), createEvent);

router.get("/events/:id", fetchEvents);

router.put("/event/join/:id", joinEvent);

router.get("/event/:id", fetchEvent);

router.put("/event/delete/:id", deleteEvent);

router.put("/event/interest/:id", eventInterest);

router.put("/event/not_interest/:id", eventNotInterest);

router.put("/event/join/:id", eventjoin);

module.exports = router;
