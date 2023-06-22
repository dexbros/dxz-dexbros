/** @format */

require("dotenv").config();
const express = require("express");
const router = express.Router();
const Multer = require("multer");
const uuid = require("uuid");
const uuidv1 = uuid.v1;
const { Storage } = require("@google-cloud/storage");
const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../../../../aerospike");
const { array } = require("yargs");
const maps = Aerospike.maps;
const now = require("nano-time");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 75 * 1024 * 1024,
  },
});

const storage = new Storage({
  projectId: "quiztasy",
  credentials: {
    client_email: "dexbros-upload@quiztasy.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCxtcYo4lgaK7gh\nV1z3UFRkV2HT28rUjuFKrQrfjEEKkzgZWgwu8V6SzPXPYmGWAFpLtYqgUP28QXoq\nXWCWLYlMcQA2OalnjNiilRy8Yq2Yjj75LPy2rKT8W14Cyr07inZxEWsrs5rS3Ycp\nw3nZnub5dxPXqewrjHPQUx0a5a6UiBDD7YdE1fHAniaxZz18yy9f6nOVWac0m5P2\ntHNgrB+CalwQIf51TCvJrfsPw0hFHHYlTWhA8ATZfPJxAXNLklo/roFr/LmfUnq0\nl1nFPQqTMj5jCOQ8DO5j0zFJvgZ/d0ePN0IOyUxhVH9Qq9oQRh7YqdDcr27Vos4H\nmXkoA36JAgMBAAECggEARyDBUqXdq4PqK/YisJ5HWO4cqsZjNZaGl/QQ0Q77DXeF\nUahYDgXv24QLstjmxDoZ6gmclbQ1Cr+OXRyIxzMsrBrigdGse1TFdLWIDeLVJqVw\nkR0vfRI26wbK5wUsnoM6CuF06sX1ZwbhzZZ+09qlCh5eI8jQTVHnHO/XS2e465uq\nIxMWwGBEy5ZVksWV+/OA+YvQMSMxar0AMvCTf2McoUGw/flxXrg4gnl/brI7p4El\nokYb6MVI38VvlQ87MshosDA4bxSj0IyHXzXHC3vJ4E1Ph1CjbHjtV4YVlLy0qH3K\n41UOEa5OPNSG5rvPAz/oQDjyFw2nuDVGpKRlqGteTQKBgQDy3xvXN7jyVr74r42V\n8H2BtyachzYtESrpLnoM4bHEZ3hzjnGrLSQUMFBleajcs+yCqcvzruW7mG5SNYNU\na7NrzncnGC1SOX5ej4oOOW8/K/cYbpqDP6f3NkKh7Xkb+xcbwuPvB+Sbl1sUNRfB\nyY5iVjr3x7GBo0g62AN52/+bvwKBgQC7UPOX/VoAmIpKXfzR9RX43/JsqIJ9WZdY\nK0ToMwskV2bN71T2u0D0/ryh6R7MeyIF5PgAZSyTFXLrlwm/GFzBXgew/4Hiud0g\n4W/h7UXpCDOWGq/Cik2VbshsCvDiJr05Q9SYEVyOj6702ZkEHNc5p1Jgao4xYKSV\nD3yZqfMXtwKBgAvG+eij0RofTr9sc+czdEKYCQ1KGTxyOqx4Dn8VarNleRfRbn2o\ngLlh5mQlVCTvrKZhaXx1nLpOF/twkN/FITw3FNwWdgwosZIQT9eEvXpIvYC3zFJV\nAeYhAXYst9S9hk9YUglDTrikzEvcjzxcc8Uc/VsKmfb5XgVMeE6udmStAoGAe+4z\nPHwC8CH8XPeSLddZki+Y1QsoSobb+xmlnXsoBANPoTCXpiZ985oWc4kpN2DAQeYb\nrydBNo8aWYS0jhowRD9SF2j1JmySQQ7mVzQE7QjgGI/PeYbHjfad493ZQccfqqOW\nJIZYFno55wWQl4f9Xce2WNQm/8RRH83/QiuPCkECgYEAz9WgZuz9tOF2Nl3qkW4I\naW7ViTE8XiFHMFZIh5LXyER98YUxVVRdNBOJtvlop6KXAIN9g8VzrOHvT34jd057\nEwAO4HDmE71PsdqrwgMCJEYGHhkv/ZXU2Hey0bqV0/ajvkcVN5mHm81j68fdqzB0\niBUDWp6KQ0+9BYstzxlNdbw=\n-----END PRIVATE KEY-----\n",
  },
});
const bucket = storage.bucket("dexbros_files");

const {
  fetchBlockcast,
  blockcastFeedProivacy,
  blockcastFeedViewPrivacy,
  blockcastChannelViewPrivacy,
  likeMessage,
  funnyMessage,
  fireMessage,
  wowMessage,
  dislikeMessage,
  bowMessage,
  createBlockcast,
  createDm,
  recomendedBlockcast,
  fetchDms,
  fetchMyBlockcast,
  fetchJoinBlockcast,
  fetchMyAllBlockcast,
  fetchMyJoinBlockcast,
  addRemoveUser,
  fetchSingleBlockcast,
  createMessageByUser,
  fetchMessages,
  deleteMessages,
  pinnedMessage,
  ChatlikeMessage,
  createBlockcastComment,
  commentReply,
  fetchComments,
  pinnedComment,
  spamComment,
  commentLike,
  addRemoveAdmin,
  editMessage,
  SingleChatlikeMessage,
  updateChatName,
  updateChatImage,
  updateBio,
  fetchMembers,
  removeGroupMembers,
  addToGroupAdmin,
  fetchAdminLists,
  addBlockList,
  fetchBlockUsersList,
  fetchPersonalMessages,
  createOneToOneChat,
  createGroupChat,
} = require("../../../../controller/blockcastController");
const { Console } = require("console");

/**
 * @START
 */

router.get("/single/:id", fetchBlockcast);
router.post("/update/feed/:id", blockcastFeedProivacy);
router.post("/update/feed/view/:id", blockcastFeedViewPrivacy);
router.post("/update/channel/view/:id", blockcastChannelViewPrivacy);
router.post("/message/likes/:id", likeMessage);
router.post("/message/funny/:id", funnyMessage);
router.post("/message/fire/:id", fireMessage);
router.post("/message/wow/:id", wowMessage);
router.post("/message/dislikes/:id", dislikeMessage);
router.post("/message/bow/:id", bowMessage);

// *** 1. Create blockcast
router.post("/", createBlockcast);

router.post("/dm/:id", createDm);

// *** 2. Fetch Recomended blockcast
router.get("/recomended", recomendedBlockcast);

router.get("/dm/:id", fetchDms);

router.get("/myblock", fetchMyBlockcast);

router.get("/join", fetchJoinBlockcast);

// *** 3. Fetch My blockcast
router.get("/mine", fetchMyAllBlockcast);

// *** 4. Fetch joined blockcast
router.get("/join", fetchMyJoinBlockcast);

// *** 4. Remove or Add in the blockCast
router.put("/add-remove/blockcast/:id", addRemoveUser);

// *** 5. Fetch single blockcast group
router.get("/:id", fetchSingleBlockcast);

// *** 6. Create block cast message by user
router.post("/message/:id", multer.single("image"), createMessageByUser);

// *** 7. Fetch all messages related to chat
router.get("/message/:id", fetchMessages);

// *** 8. Delete message
router.delete("/message/delete/:id", deleteMessages);

router.put("/message/pinn/:id", pinnedMessage);

router.put("/message/like/:id", ChatlikeMessage);

router.post("/comment/:id", multer.single("image"), createBlockcastComment);

router.post("/comment/reply/:id", commentReply);

router.get("/comment/:id", fetchComments);

router.put("/comment/pinn/:id", pinnedComment);

router.put("/comment/spam/:id", spamComment);

router.put("/comment/like/:id", commentLike);

router.put("/admin/:blockId", addRemoveAdmin);

router.post("/edit/message/:id", editMessage);

router.post("/like/message/:id", SingleChatlikeMessage);

// **** Update group chat name
router.put("/update/name/:id", updateChatName);

// *** Update group image
router.put("/update/image/:id", multer.single("image"), updateChatImage);

// **** Update group chat descripton
router.put("/update/descripton/:id", updateBio);

// *** Get users of group
router.post("/fetch/members/:id", fetchMembers);

// **** Remove from group
router.put("/remove/member/:id", removeGroupMembers);

router.put("/admin/member/:id", addToGroupAdmin);

router.post("/fetch/admins/:id", fetchAdminLists);

router.put("/block/member/:id", addBlockList);

router.post("/fetch/block/members/:id", fetchBlockUsersList);

/**
 * @END
 */

router.post("/save/message/:id", async (req, res) => {
  const client = await getAerospikeClient();
  if (!req.params.id) {
    return res.status(400).json({ msg: "Invalid request" });
  } else {
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      SET_BLOCK_COMMENT,
      req.params.id
    );
    const data = await client.get(key);

    if (data.bins.save && data.bins.save.includes(req.user.handleUn)) {
      const ops = [Aerospike.lists.removeByValue("save", req.user.handleUn)];
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
});

router.post("/fetch/admins/:id", async (req, res) => {
  // console.log(req.body)
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
});

/***
 * @MESSAGES
 */

// *** Create single chat system
router.post("/personal/:username", createOneToOneChat);

router.get("/personal/chat", fetchPersonalMessages);
router.post("/group/chat", createGroupChat);

module.exports = router;
