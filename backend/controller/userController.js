/** @format */

const jwt = require("jsonwebtoken");
const Multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const Aerospike = require("aerospike");
const lists = Aerospike.lists;
const maps = Aerospike.maps;
const { getAerospikeClient } = require("../aerospike");
const { removeStopwords, eng, fra } = require("stopword");
const now = require("nano-time");
const batchType = Aerospike.batchType;
var createError = require("http-errors");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const uuid = require("uuid");
const uuidv1 = uuid.v1;

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
    fileSize: 75 * 1024 * 1024,
  },
});
const bucket = storage.bucket("dexbros_files");
const mailgun = require("mailgun-js");
const {
  profileUpdateGender,
  updateProfileLanguage,
  updateProfileCountry,
  updateProfileBod,
  updateProfileHandleName,
  updateProfileBio,
  updateProfileLinks,
  updateProfileFollowPrivacy,
  updateCommentPrivacy,
  updateProfileVisit,
  socialupdateProfileVisit,
  updateProfilePassword,
  updateMessagePrivacy,
  updateCoverImage,
  addFollowUser,
  getFollowers,
  updateProfileVisitCount,
  fetchProfileAnalytics,
  fetchSearchUser,
  fetchSuggestedUsers,
  fetchSuggestedUserOne,
  updateProfileHobbies,
  updateVerifyProfile,
  verifyProfileKey,
  getFullProfile,
  fetchSuggestedUserTwo,
  updateUserInfo,
  updateUserInterestInfo,
  updateAndSetUserInfo,
  getGCMBatch,
  getMBBatch,
  getCheckBadges,
  updateProfileCoverImage,
  updateProfileImage,
  updateProfileAvatar,
  updateProfileImageAvatar,
  updateProfileVisitorsCount,
} = require("../model/ProfileModal");
const FormData = require("form-data");
var api_key = "880eec1d67de21541e7f90936d8c5d98-d2cc48bc-b7a194a6";
var domain = "sandbox9826fdccdb404038a93ba6ad560ca121.mailgun.org";
var mg = require("mailgun-js")({ apiKey: api_key, domain: domain });

class UserController {
  constructor() {
    console.log("User controller init");
  }

  // *** Update visitors count
  async handleUpdateVisitors(req, res) {
    try {
      if (!req.params.handleUn) {
        throw createError.BadRequest("Request parameter is not present");
      } else {
        const data = await updateProfileVisitorsCount(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user gender
  async updateGender(req, res, next) {
    try {
      if (!req.body.gender) {
        throw createError.BadRequest("Gender is not defined");
      } else {
        const data = await profileUpdateGender(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateProfileAvatar(req, res, next) {
    try {
      if (!req.body.url) {
        throw createError.BadRequest("Invalid image url");
      } else {
        const data = await updateProfileImageAvatar(
          req.user.handleUn,
          req.body
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user language
  async updateLanguage(req, res, next) {
    try {
      if (!req.body.language) {
        throw createError.BadRequest("Language is not defined");
      } else {
        const data = await updateProfileLanguage(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateBirthDay(req, res, next) {
    try {
      const data = await updateProfileBod(req.user.handleUn, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Update user Country
  async updateCountry(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.country) {
        throw createError.BadRequest("Country is not defined");
      } else {
        const data = await updateProfileCountry(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user Country
  async updateDisplayName(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.name) {
        throw createError.BadRequest("Country is not defined");
      } else {
        const data = await updateProfileHandleName(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user About
  async updateAbout(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.bio) {
        throw createError.BadRequest("Country is not defined");
      } else {
        const data = await updateProfileBio(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user profile links
  async updateLink(req, res, next) {
    try {
      if (!req.body.link) {
        throw createError.BadRequest("Link is not defined");
      } else {
        const data = await updateProfileLinks(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user profile follow following privacy
  async updateProfilePrivacy(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.profileprivacy) {
        throw createError.BadRequest("Profile privacy is not defined");
      } else {
        const data = await updateProfileFollowPrivacy(
          req.user.handleUn,
          req.body
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user post comment privacy
  async updateProfileCommentPrivacy(req, res, next) {
    try {
      const client = await getAerospikeClient();
      console.log(req.body.cmnt_prv);
      if (!req.body.cmnt_prv) {
        throw createError.BadRequest("Post Comment prefrence is not defined");
      } else {
        const data = await updateCommentPrivacy(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user profile privacy
  async updateProfileVisitPrivacy(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.prfl_prv) {
        throw createError.BadRequest("Profile privacy is not defined");
      } else {
        const data = await socialupdateProfileVisit(
          req.user.handleUn,
          req.body
        );
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update user password
  async updateUserPassword(req, res, next) {
    try {
      const data = await updateProfilePassword(req.user.handleUn, req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Update user profile message privacy
  async updateProfileMessagePrivacy(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.body.msgPrivacy) {
        throw createError.BadRequest("Profile privacy is not defined");
      } else {
        const data = await updateMessagePrivacy(req.user.handleUn, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Upload profile picture
  async uploadProfilePicture(req, res, next) {
    console.log(">>>> Call ", req.file);
    try {
      const data = await updateProfileImage(req.file, req.user.handleUn);
      console.log("Profile Data: ", data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Upload cover picture
  async uploadCoverImage(req, res, next) {
    console.log("Call came in BACKEND");
    const data = await updateProfileCoverImage(req.file, req.user.handleUn);
    console.log("Data: ", data);
    return res.status(200).json(data);
  }

  /**
   *CHECK
   */
  // *** Fetch all followers list
  async fetchFollowersList(req, res) {
    console.log("fetchFollowersList");
    if (!req.params.handleUn) {
      return res.status(401).json({ msg: "Invalid request params" });
    } else {
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META
      );
      // console.log(req.params);
      const tempBin = "ExpVar";
      // query.select("flwr"); //select single bin
      query.where(Aerospike.filter.equal("handleUn", req.params.handleUn));
      const stream = query.foreach();
      var arr = [];
      var temp = [];
      var users = null;

      stream.on("data", function (record) {
        arr = record.bins.flwr;
        users = record.bins;
        console.log(record.bins);
      });

      stream.on("end", function (record) {
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
        client.batchRead(temp, async (err, results) => {
          temp = results;
          var page = req.query.page || 1;
          var limit = 5;
          var start = (page - 1) * limit;
          var end = page * limit;
          temp = temp.splice(start, end);
          // console.log(temp);
          return res.status(200).json({ user: users, list: temp });
        });
      });
    }
  }

  /**
   *CHECK
   */
  async fetchFollowingList(req, res, next) {
    if (!req.params.handleUn) {
      return res.status(401).json({ msg: "Invalid request params" });
    } else {
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META
      );
      // console.log(req.params);
      const tempBin = "ExpVar";
      // query.select("flwr"); //select single bin
      query.where(Aerospike.filter.equal("handleUn", req.params.handleUn));
      const stream = query.foreach();
      var arr = [];
      var temp = [];
      var users = null;

      stream.on("data", function (record) {
        arr = record.bins.flw;
        users = record.bins;
        console.log(record.bins);
      });

      stream.on("end", function (record) {
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
        client.batchRead(temp, async (err, results) => {
          temp = results;
          var page = req.query.page || 1;
          var limit = 5;
          var start = (page - 1) * limit;
          var end = page * limit;
          temp = temp.splice(start, end);
          // console.log(temp);
          return res.status(200).json({ user: users, list: temp });
        });
      });
    }
  }

  async selectInterested(req, res, next) {
    if (!req.params.handleUn) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const client = await getAerospikeClient();
      var key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        req.params.handleUn
      );
      const data = await client.get(key);
      // interest
      data.bins.interest = req.body.intesrests;

      const userData = await client.put(key, data.bins);

      try {
        const data = await client.get(key);
        return res.status(200).json({ user: data.bins });
      } catch (err) {
        return res.status(401).json({ msg: err.message });
      }
    }
  }

  async updateBio(req, res, next) {}

  async updateLocation(req, res) {}

  async hideUser(req, res) {
    // if (!req.params.handleUn) {
    //   return res.status(400).json({ msg: "Invalid request params" });
    // } else {
    //   const viewProfile = req.params.handleUn;
    //   const client = await getAerospikeClient();
    //   const user_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.params.handleUn
    //   );
    //   const result = await client.exists(user_key);
    //   try {
    //     const profile_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_USERS,
    //       req.user.handleUn
    //     );
    //     const result = await client.get(profile_key);
    //     if (!result) {
    //       return res.status(40).json({ msg: "User does not exists" });
    //     } else {
    //       const profile_key = new Aerospike.Key(
    //         process.env.CLUSTER_NAME,
    //         process.env.SET_USERS,
    //         req.user.handleUn
    //       );
    //       const profile = await client.get(profile_key);
    //       const profileData = profile.bins;
    //       const isHide = profileData.block
    //         ? profileData.block.includes(req.params.handleUn)
    //         : false;
    //       if (!isHide) {
    //         const ops = [
    //           Aerospike.lists.append(
    //             process.env.SET_BLOCKCAST,
    //             req.params.handleUn
    //           ),
    //         ];
    //         client
    //           .operate(profile_key, ops)
    //           .then(async (data) => {
    //             const ops = [
    //               Aerospike.lists.append("blockBy", req.user.handleUn),
    //             ];
    //             client
    //               .operate(user_key, ops)
    //               .then(async (data) => {
    //                 const key = new Aerospike.Key(
    //                   process.env.CLUSTER_NAME,
    //                   process.env.SET_USERS,
    //                   req.user.handleUn
    //                 );
    //                 const user = await client.get(key);
    //                 return res
    //                   .status(200)
    //                   .json({ msg: "You hide this user", user: user.bins });
    //               })
    //               .catch((err) => {
    //                 return res.status(400).json({ msg: err.message });
    //               });
    //           })
    //           .catch((err) => {
    //             return res.status(400).json({ msg: err.message });
    //           });
    //       } else {
    //         const ops = [
    //           Aerospike.lists.removeByValue(
    //             process.env.SET_BLOCKCAST,
    //             req.params.handleUn
    //           ),
    //         ];
    //         client
    //           .operate(profile_key, ops)
    //           .then(async (data) => {
    //             const ops = [
    //               Aerospike.lists.removeByValue("blockBy", req.user.handleUn),
    //             ];
    //             client
    //               .operate(user_key, ops)
    //               .then(async (data) => {
    //                 const key = new Aerospike.Key(
    //                   process.env.CLUSTER_NAME,
    //                   process.env.SET_USERS,
    //                   req.user.handleUn
    //                 );
    //                 const user = await client.get(key);
    //                 return res
    //                   .status(200)
    //                   .json({ msg: "You unhide this user", user: user.bins });
    //               })
    //               .catch((err) => {
    //                 return res.status(400).json({ msg: err.message });
    //               });
    //           })
    //           .catch((err) => {
    //             return res.status(400).json({ msg: err.message });
    //           });
    //       }
    //     }
    //   } catch (err) {
    //     return res.status(400).json({ msg: err.message });
    //   }
    // }
  }

  async fetchHideUsers(req, res) {
    // const client = await getAerospikeClient();
    // const user_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_USERS,
    //   req.user.handleUn
    // );
    // const result = await client.exists(user_key);
    // try {
    //   if (!result) {
    //     return res.status(400).json({ msg: "User not exists" });
    //   } else {
    //     let query = client.query(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_USERS
    //     );
    //     const tempBin1 = "ExpVar";
    //     // query.select([process.env.SET_BLOCKCAST]);
    //     query.where(Aerospike.filter.equal("handleUn", req.user.handleUn));
    //     const stream = query.foreach();
    //     var temp = [];
    //     stream.on("data", async function (record) {
    //       const arr = record.bins.block;
    //       for (let i = 0; i < arr.length; i++) {
    //         temp.push({
    //           key: new Aerospike.Key(
    //             process.env.CLUSTER_NAME,
    //             process.env.SET_USERS,
    //             arr[i]
    //           ),
    //           readAllBins: true,
    //         });
    //       }
    //     });
    //     stream.on("data", async function (record) {
    //       if (temp.length > 0) {
    //         client.batchRead(temp, async (err, results) => {
    //           if (err) {
    //             return res.status(400).json({ msg: err.message });
    //           } else {
    //             var users = [];
    //             results.map((data) => {
    //               if (data.record.bins) {
    //                 users.push(data.record.bins);
    //               }
    //             });
    //             var page = req.query.page;
    //             var limit = req.query.limit;
    //             var start = (page - 1) * limit;
    //             var end = page * limit;
    //             users = users.slice(start, end);
    //             return res.status(200).json(users);
    //           }
    //         });
    //       } else {
    //         return res.status(400).json({ msg: "No user found" });
    //       }
    //     });
    //   }
    // } catch (err) {
    //   return res.status(400).json({ msg: err.message });
    // }
  }

  async unHideUser(req, res) {
    // if (!req.params.handleUn) {
    //   return res.status(401).json({ msg: "Invalid request" });
    // } else {
    //   const client = await getAerospikeClient();
    //   var user_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.params.handleUn
    //   );
    //   var user_ops = [Aerospike.lists.removeByValue("hide", req.user.handleUn)];
    //   client.operate(user_key, user_ops, async (err, result) => {
    //     if (err) {
    //       return res.status(401).json({ msg: err.message });
    //     } else {
    //       const data = await client.get(user_key);
    //       return res
    //         .status(200)
    //         .json({ msg: "You unhide this user", user: data });
    //     }
    //   });
    // }
  }

  async blockUser(req, res) {
    // if (!req.params.handleUn) {
    //   return res.status(401).json({ msg: "Invalid request" });
    // } else {
    //   const client = await getAerospikeClient();
    //   // Visited user
    //   var user_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.params.handleUn
    //   );
    //   var user_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USER_META,
    //     req.params.handleUn
    //   );
    //   const user_meta_data = await client.get(user_meta_key);
    //   const ops1 = [
    //     Aerospike.lists.removeByValue("flwr", req.user.handleUn),
    //     Aerospike.lists.removeByValue("flw", req.user.handleUn),
    //   ];
    //   const ops2 = [
    //     Aerospike.operations.incr("following_c", -1),
    //     Aerospike.operations.incr("follower_c", -1),
    //   ];
    //   // client.operate(user_key, ops2);
    //   client.operate(user_meta_key, ops1);
    //   // current logged in user
    //   var active_user_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.user.handleUn
    //   );
    //   var active_user_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USER_META,
    //     req.user.handleUn
    //   );
    //   const ops3 = [
    //     Aerospike.lists.removeByValue("flwr", req.params.handleUn),
    //     Aerospike.lists.removeByValue("flw", req.params.handleUn),
    //   ];
    //   const ops4 = [
    //     Aerospike.operations.incr("following_c", -1),
    //     Aerospike.operations.incr("follower_c", -1),
    //   ];
    //   client.operate(active_user_key, ops4);
    //   client.operate(active_user_meta_key, ops3);
    //   const ops5 = [Aerospike.lists.removeByValue("blocks", req.user.handleUn)];
    //   client.operate(user_key, ops5, async (err, result) => {
    //     if (err) {
    //       return res.status(401).json({ msg: err.message });
    //     } else {
    //       console.log(result);
    //       const data = await client.get(active_user_key);
    //       return res
    //         .status(200)
    //         .json({ msg: "You block this user", user: data });
    //     }
    //   });
    // }
  }

  async unBlockUser(req, res) {
    // if (!req.params.handleUn) {
    //   return res.status(401).json({ msg: "Invalid request" });
    // } else {
    //   const client = await getAerospikeClient();
    //   var user_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.params.handleUn
    //   );
    //   var user_ops = [
    //     Aerospike.lists.removeByValue(
    //       process.env.SET_BLOCKCAST,
    //       req.user.handleUn
    //     ),
    //   ];
    //   client.operate(user_key, user_ops, async (err, result) => {
    //     if (err) {
    //       return res.status(401).json({ msg: err.message });
    //     } else {
    //       const data = await client.get(user_key);
    //       return res
    //         .status(200)
    //         .json({ msg: "You unblock this user", user: data });
    //     }
    //   });
    // }
  }

  async updateProfileVisit(req, res, next) {
    try {
      const profile = req.params.profile;
      const data = await updateProfileVisitCount(profile, req.user.handleUn);
      console.log("DATA: ", data);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async getProfileAnalytics(req, res, next) {
    try {
      const data = await fetchProfileAnalytics(req.params.username);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async searchUser(req, res) {
    const data = await fetchSearchUser(req.query.search, req.user.handleUn);
    return res.status(200).json(data);
  }

  async updatePersonalInfo(req, res) {
    const handleUn = req.params.id;
    const client = await getAerospikeClient();
    if (!handleUn) {
      return res.status(400).json({ msg: "Invalid request parameter" });
    } else {
      if (!req.body.log_un.trim() || !req.body.name.trim()) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        // var query = client.query(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USERS
        // );
        // const user_key = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USERS,
        //   handleUn
        // );

        // query.where(Aerospike.filter.equal("handleUn", handleUn));
        // const queryPolicy = new Aerospike.QueryPolicy();
        // const stream = query.foreach();
        // var user_obj = null;
        // stream.on("data", function (record) {
        //   user_obj = record.bins;
        // });

        // stream.on("end", function (record) {
        //   const name = req.body.name.split(" ");
        //   const ops = [
        //     Aerospike.operations.write("fn", name[0]),
        //     Aerospike.operations.write("ln", name[1] || ""),
        //     Aerospike.operations.write("log_un", req.body.log_un),
        //   ];
        //   client
        //     .operate(user_key, ops)
        //     .then(async (response) => {
        //       const data = await client.get(user_key);
        //       const token = jwt.sign({ data: data.bins }, "secret");
        //       return res.status(200).json({
        //         msg: "User info updated",
        //         user: data.bins,
        //         token: token,
        //       });
        //     })
        //     .catch((err) => {
        //       return res.status(400).json({ msg: err.message });
        //     });
        // });
        const data = await updateUserInfo(handleUn, req.body);
        return res.status(200).json(data);
      }
    }
  }

  async getSuggestList(req, res, next) {
    const client = await getAerospikeClient();
    var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
    // query.where(Aerospike.filter.equal("handleUn", handleUn));
    const queryPolicy = new Aerospike.QueryPolicy();
    query.select("u_id", "handleUn");
    const stream = query.foreach();
    var temp = [];

    stream.on("data", function (record) {
      if (record.bins.handleUn !== req.user.handleUn) {
        temp.push({ id: record.bins.u_id, display: record.bins.handleUn });
      }
    });

    stream.on("end", function (record) {
      // var arr = temp.sort((a, b) => a.u_details.flwr_c - b.u_details.flwr_c);
      // console.log(temp);
      return res.status(200).json(temp);
    });
    try {
      const data = await fetchSuggestedUsers(req.user.handleUn);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async updateInterest(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ msg: "Invalid request params" });
      } else {
        const client = await getAerospikeClient();
        const user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          id
        );
        const result = await client.exists(user_key);
        if (!result) {
          return res.status(400).json({ msg: "Invalid user id" });
        } else {
          // var query = client.query(
          //   process.env.CLUSTER_NAME,
          //   process.env.SET_USERS
          // );

          // // query.where(Aerospike.filter.equal("handleUn", req.body.handleUn));
          // const queryPolicy = new Aerospike.QueryPolicy();
          // const stream = query.foreach();
          // var user_obj = null;
          // stream.on("data", function (record) {
          //   user_obj = record;
          // });

          // stream.on("end", function (record) {
          //   const ops = [
          //     Aerospike.operations.write("interest", req.body.selected),
          //   ];
          //   client
          //     .operate(user_key, ops)
          //     .then(async (response) => {
          //       const data = await client.get(user_key);
          //       const token = jwt.sign({ data: data.bins }, "secret");
          //       return res.status(200).json({
          //         msg: "User interest updated",
          //         user: data.bins,
          //         token: token,
          //       });
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //     });
          // });
          const data = await updateUserInterestInfo(req.params.id, req.body);
          return res.status(200).json(data);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async updateInfo(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Invalid request params" });
    } else {
      // const client = await getAerospikeClient();
      // const user_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_USERS,
      //   id
      // );
      // // const result = await client.exists(user_key);
      // var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);

      // // query.where(Aerospike.filter.equal("handleUn", req.body.handleUn));
      // const queryPolicy = new Aerospike.QueryPolicy();
      // const stream = query.foreach();
      // var user_obj = null;
      // stream.on("data", function (record) {
      //   user_obj = record;
      // });

      // stream.on("end", function (record) {
      //   client
      //     .get(user_key)
      //     .then((data) => {
      //       const token = jwt.sign({ data: data.bins }, "secret");
      //       return res.status(200).json({
      //         msg: "User interest updated",
      //         user: data.bins,
      //         token: token,
      //       });
      //     })
      //     .catch((err) => {
      //       return res.status(500).json({ msg: err.message });
      //     });
      // });
      const data = await updateAndSetUserInfo(req.user.handleUn);
      return res.status(200).json(data);
    }
  }

  async suggestions(req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Invalid request parameter" });
    } else {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        if (record.bins.handleUn !== id) {
          arr.push(record.bins);
        }
      });

      stream.on("end", function (record) {
        var temp = arr.sort((a, b) => b.flwr_c - a.flwr_c).splice(0, 10);
        return res.status(200).json(temp);
      });
      // const data = await fetchSuggestedUserOne(id);
      // return res.status(200).json(data);
    }
  }

  async updateName(req, res) {}

  async updateHobbies(req, res, next) {
    // const client = await getAerospikeClient();
    // const user_key = new Aerospike.Key(
    //   process.env.CLUSTER_NAME,
    //   process.env.SET_USERS,
    //   req.user.handleUn
    // );
    // client
    //   .exists(user_key)
    //   .then((result) => {
    //     if (!result) {
    //       return res.status(400).json({ msg: "User not found" });
    //     } else {
    //       const ops = [
    //         Aerospike.operations.write(
    //           "u_hobbies",
    //           JSON.parse(req.body.hobbies)
    //         ),
    //       ];
    //       client.operate(user_key, ops, (err, result) => {
    //         if (err) {
    //           return res.status(400).json({ msg: err.message });
    //         } else {
    //           return res.status(200).json({ msg: "Hobbies updated", result });
    //         }
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     return res.status(400).json({ msg: err.message });
    //   });

    try {
      const data = await updateProfileHobbies(req.user.handleUn, req.body);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileInfo(req, res) {}

  async handleFollowFollowing(req, res) {
    var count;
    if (!req.params.handleUn) {
      return res.status(400).json({ msg: "Invalid following request" });
    } else {
      const data = await addFollowUser(
        req.user.handleUn,
        req.params.handleUn,
        req.user
      );
      return res.status(200).json(data);
    }
  }

  async verifyProfile(req, res, next) {
    try {
      // const client = await getAerospikeClient();
      // const key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_USERS,
      //   req.user.handleUn
      // );
      // client
      //   .exists(key)
      //   .then(async (data) => {
      //     if (!data) {
      //       return res.status(400).json({ msg: "Invalid user" });
      //     } else {
      //       const user = await client.get(key);
      //       var char = uuidv4();
      //       var result = char.slice(char.length - 6);
      //       const ops = [Aerospike.operations.write("v_code", result)];
      //       console.log(result);
      //       client
      //         .operate(key, ops)
      //         .then(async (data) => {
      //           console.log(data);
      //           const token = jwt.sign(
      //             { handleUn: req.user.handleUn, keyCode: result },
      //             "secret",
      //             { expiresIn: "1h" }
      //           );
      //           console.log(token);
      //           const mailData = {
      //             from: "noreply@test.com",
      //             to: "goswami.avi14@gmail.com",
      //             subject: "Profile Verification",
      //             text: `Verify your profile by click on the below link`,
      //             html: `<a href=http://localhost:3000/verify/${token}>Click here</a>`,
      //           };
      //           mg.messages().send(mailData, function (error, body) {
      //             return res
      //               .status(200)
      //               .json({ msg: "Verification mail has been send" });
      //           });
      //         })
      //         .catch((err) => {
      //           return res.status(400).json({ msg: err.message });
      //         });
      //     }
      //   })
      //   .catch((err) => {
      //     return res.status(400).json({ msg: err.message });
      //   });
      const data = await updateVerifyProfile(req.user.handleUn);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async verifyKey(req, res) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      // const client = await getAerospikeClient();
      // const verify = jwt.verify(req.params.id, "secret");
      // console.log(verify);
      // if (verify.handleUn === req.user.handleUn) {
      //   var key = new Aerospike.Key(
      //     process.env.CLUSTER_NAME,
      //     process.env.SET_USERS,
      //     verify.handleUn
      //   );
      //   const user = await client.get(key);
      //   if (user.bins.v_code === verify.keyCode) {
      //     const ops = [Aerospike.operations.write("isVerified", true)];
      //     client
      //       .operate(key, ops)
      //       .then(async (data) => {
      //         const user = await client.get(key);
      //         return res
      //           .status(200)
      //           .json({ msg: "Profile has been verified", user: user.bins });
      //       })
      //       .catch((err) => {
      //         return res.status(400).json({ msg: err.message });
      //       });
      //   }
      // }
      const data = await verifyProfileKey(req.params.id, req.user.handleUn);
      return res.status(200).json(data);
    }
  }

  async socialLinks(req, res) {}

  async fetchFullProfile(req, res, next) {
    try {
      if (!req.params.handleUn) {
        return res.status(400).json({ msg: "Invalid request" });
      } else {
        // const client = await getAerospikeClient();
        // var user = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USERS,
        //   req.params.handleUn
        // );
        // const user_meta = new Aerospike.Key(
        //   process.env.CLUSTER_NAME,
        //   process.env.SET_USER_META,
        //   req.params.handleUn
        // );
        // const userData = await client.get(user);
        // const userMetaData = await client.get(user_meta);

        // const result = { ...userData.bins, ...userMetaData.bins };
        // return res.status(200).json(result);
        const data = await getFullProfile(req.user.handleUn);
        return res.status(200).json(data);
      }
    } catch (err) {
      next(err);
    }
  }

  async gcmBadge(req, res, next) {
    try {
      const data = await getGCMBatch(req.user.handleUn, req.body);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  // content creator badge
  async ccBadge(req, res, next) {
    // const badge = req.body.badge;
    // if (badge === "cc") {
    //   const client = await getAerospikeClient();
    //   const key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_USERS,
    //     req.user.handleUn
    //   );
    //   const data = await client.get(key);
    //   const user = data.bins;
    //   if (
    //     user.flwr_c === Number("1") &&
    //     user.post_c === Number("1") &&
    //     user.isVerified
    //   ) {
    //     const ops = [Aerospike.lists.append("badge", "cc")];
    //     client
    //       .operate(key, ops)
    //       .then((data) => {
    //         return res.status(200).json({ msg: "You get cc badge", data });
    //       })
    //       .catch((err) => {
    //         return res.status(400).json({ msg: err.message });
    //       });
    //   } else {
    //     const ops = [Aerospike.lists.removeByValue("badge", "cc")];
    //     client
    //       .operate(key, ops)
    //       .then((data) => {
    //         return res
    //           .status(200)
    //           .json({ msg: "Your CC badge has been removed", data });
    //       })
    //       .catch((err) => {
    //         return res.status(400).json({ msg: err.message });
    //       });
    //   }
    // }
    try {
      const data = await getGCMBatch(req.user.handleUn, req.body);
    } catch (err) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async MBbadge(req, res, next) {
    try {
      const data = await getMBBatch(req.user.handleUn, req.body.badge);
    } catch (err) {
      next(err);
    }
  }

  async checkBadges(req, res, next) {
    try {
      const data = await getCheckBadges(req.user.handleUn);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async fetchSuggestedUser(req, res, next) {
    try {
      var page = req.query.page || 1;
      var limit = req.query.limit || 5;
      const data = await fetchSuggestedUserTwo(req.user.handleUn, page, limit);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
