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
    fileSize: 75 * 1024 * 1024,
  },
});
const bucket = storage.bucket("dexbros_files");
const mailgun = require("mailgun-js");
var api_key = "880eec1d67de21541e7f90936d8c5d98-d2cc48bc-b7a194a6";
var domain = "sandbox9826fdccdb404038a93ba6ad560ca121.mailgun.org";
var mg = require("mailgun-js")({ apiKey: api_key, domain: domain });

class UserModal {
  constructor() {}

  async updateProfileImageAvatar(handleUn, data) {
    const client = await getAerospikeClient();
    var user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUn
    );
    const arr = data.url.split("/");
    const temp = arr[arr.length - 2].split("_");
    const str = `_${temp[temp.length - 1]}/${arr[arr.length - 1]}`;
    console.log(str);
    console.log(str.includes("dexbros_ai"));
    const ops = [
      Aerospike.operations.write("p_i", str),
      Aerospike.operations.write("isFree", false),
    ];
    const updateUser = await client.operate(user_key, ops);
    const user = await client.get(user_key);
    const token = jwt.sign({ data: user.bins }, "secret");
    return { user: user.bins, token };
  }

  async updateProfileCoverImage(file, handleUn) {
    return new Promise(async (resolve, reject) => {
      const publicURL = await uploadImage(file);
      console.log("PUBLIC URL: ", publicURL);
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const user_ops = [Aerospike.operations.write("c_i", publicURL)]; // coverPicture

      client.operate(user_key, user_ops, async (err, result) => {
        if (err) {
          throw createError.Conflict({ msg: err.message });
        } else {
          const data = await client.get(user_key);
          const token = jwt.sign({ data: data.bins }, "secret");
          resolve({ user: data.bins, token: token });
        }
      });
    });
  }

  async updateProfileImage(file, handleUn) {
    return new Promise(async (resolve, reject) => {
      const publicURL = await uploadImage(file);
      console.log("Public url: ", publicURL);
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const user_ops = [Aerospike.operations.write("p_i", publicURL)];
      client.operate(user_key, user_ops, async (err, result) => {
        if (err) {
          throw createError.Conflict({ msg: err.message });
        } else {
          const data = await client.get(user_key);
          const token = jwt.sign({ data: data.bins }, "secret");
          resolve({ user: data.bins, token: token });
        }
      });
    });
  }

  async profileUpdateGender(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("gen", data.gender)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile gender updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileLanguage(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("lan", data.language)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile language updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileCountry(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("con", data.country)];
      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile country updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileBod(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const date = data.dob.split("T");
      console.log(date);
      const ops = [Aerospike.operations.write("dob", date[0])];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile birthday updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileHandleName(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("dn", data.name)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile display name has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileBio(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("p_bio", data.bio)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile bio has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileLinks(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write(data.linkName, data.link)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile bio has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfileFollowPrivacy(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [
        Aerospike.operations.write("profile_prv", data.profileprivacy),
      ];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "profile privacy has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateCommentPrivacy(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("cmnt_prv", data.cmnt_prv)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "Post Comment  has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async socialupdateProfileVisit(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );

      console.log(data);
      const ops = [Aerospike.operations.write("prfl_prv", data.prfl_prv)];

      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "Profile privacy  has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async updateProfilePassword(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const { currentPassword, newPassword } = data;

      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );

      client
        .exists(key)
        .then(async (data) => {
          if (!data) {
            throw createError.BadRequest("No user found");
          } else {
            const data = await client.get(key);
            bcrypt
              .compare(currentPassword, data.bins.password)
              .then(async (data) => {
                if (!data) {
                  throw createError.BadRequest("Not a correct password");
                } else {
                  const hash = await bcrypt.hash(newPassword, 10);
                  const ops = [Aerospike.operations.write("password", hash)];
                  client.operate(key, ops, (err, result) => {
                    if (err) {
                      throw createError.BadRequest(err.message);
                    } else {
                      resolve({ msg: "Password has been changed" });
                    }
                  });
                }
              })
              .catch((err) => {
                throw createError.BadRequest("Not a correct password");
              });
          }
        })
        .catch((err) => {
          throw createError.BadRequest("Not a correct password");
        });
    });
  }

  async updateMessagePrivacy(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const ops = [Aerospike.operations.write("msg_prv", data.msgPrivacy)];
      client
        .operate(user_key, ops)
        .then(async (data) => {
          const user = await client.get(user_key);
          try {
            const token = jwt.sign({ data: user.bins }, "secret");
            resolve({
              msg: "Profile message privacy  has been updated",
              user: user.bins,
              token: token,
            });
          } catch (error) {
            throw createError.BadRequest(error.message);
          }
        })
        .catch((error) => {
          throw createError.BadRequest(error.message);
        });
    });
  }

  async addFollowUser(handleUn, profileHandleUn, user) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const batchType = Aerospike.batchType;
      let user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      let user_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        handleUn
      );
      let profile_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        profileHandleUn
      );
      let profile_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        profileHandleUn
      );

      client.exists(profile_meta_key, async (err, result) => {
        if (err) {
          throw createError.BadRequest(err.message);
        } else {
          const user_meta_data = await client.get(user_meta_key);
          let batchPolicy1 = new Aerospike.BatchPolicy({});
          var batchArrKeys = [];

          const isFollower = user_meta_data.bins.flw.includes(profileHandleUn);
          batchArrKeys = [
            user_key,
            user_meta_key,
            profile_key,
            profile_meta_key,
          ];
          var batchRecords = [];

          for (let i = 0; i < batchArrKeys.length; i++) {
            if (batchArrKeys[i].key === handleUn) {
              console.log("**** My user account operations ***");
              if (!isFollower) {
                if (batchArrKeys[i].set === process.env.SET_USERS) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.operations.incr("flw_c", 1)],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.lists.append("flw", profileHandleUn)],
                  });
                }
              } else {
                if (batchArrKeys[i].set === process.env.SET_USERS) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.operations.incr("flw_c", -1)],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [
                      Aerospike.lists.removeByValue("flw", profileHandleUn),
                    ],
                  });
                }
              }
            } else {
              console.log("######## Other user operations ########");
              if (!isFollower) {
                if (batchArrKeys[i].set === process.env.SET_USERS) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.operations.incr("flwr_c", 1)],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.lists.append("flwr", handleUn)],
                  });
                }
              } else {
                if (batchArrKeys[i].set === process.env.SET_USERS) {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.operations.incr("flwr_c", -1)],
                  });
                } else {
                  batchRecords.push({
                    type: batchType.BATCH_WRITE,
                    key: batchArrKeys[i],
                    ops: [Aerospike.lists.removeByValue("flwr", handleUn)],
                  });
                }
              }
            }
          }
          await client.batchWrite(batchRecords, batchPolicy1);

          try {
            const map_key = new Aerospike.Key(
              process.env.CLUSTER_NAME,
              process.env.SET_APP_HISTORY,
              profileHandleUn
            );
            var notificationData = {
              id: user.handleUn,
              ty: 3,
              vi: false,
              wo: user.handleUn,
              ti: Date.now(),
              nm: `${user.fn} ${user.ln}`,
              pi: user.p_i,
              cat: 0,
              re: profileHandleUn,
            };
            if (!isFollower) {
              const map_ops = [
                Aerospike.operations.write("n_id", profileHandleUn),
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
              resolve({ msg: "You follwed successfully", notificationData });
            } else {
              resolve({ msg: "You unfollowed this user" });
            }
          } catch (err) {
            throw createError.BadRequest(err.message);
          }
        }
      });
    });
  }

  async getFollowers(handleUn, page) {
    return new Promise(async (resolve, reject) => {
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();
      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META
      );
      const tempBin = "ExpVar";
      // query.select("flwr"); //select single bin
      query.where(Aerospike.filter.equal("handleUn", handleUn));
      const stream = query.foreach();
      var arr = [];
      var temp = [];
      var users = null;

      stream.on("data", function (record) {
        arr = record.bins.flwr;
        users = record.bins;
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        console.log("Array: ", arr);
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
          console.log(results.bins);
          var limit = 5;
          var start = (page - 1) * limit;
          var end = page * limit;
          temp = temp.splice(start, end);
          console.log(temp);
          return { user: users, list: temp };
        });
      });
    });
  }

  async updateProfileVisitCount(profile, handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const user_meta_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USER_META,
        profile
      );
      const userData = await client.get(user_meta_key);
      const visitors_ops = [Aerospike.operations.incr("visitors", 1)];

      client.operate(user_meta_key, visitors_ops, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ msg: err.message });
        } else {
          if (
            !userData.bins.u_visitors ||
            !userData.bins.u_visitors.includes(handleUn)
          ) {
            console.log("First Time");
            const unique_visitor_ops = [
              Aerospike.lists.append("u_visitors", handleUn),
            ];
            client.operate(user_meta_key, unique_visitor_ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Viewed profile" });
              }
            });
          } else {
            console.log("Viewed profile");
            resolve({ msg: "Viewed profile" });
          }
        }
      });
    });
  }

  async fetchProfileAnalytics(handleUn) {
    const client = await getAerospikeClient();
    var user_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUn
    );
    const user_meta_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USER_META,
      handleUn
    );
    const userData = await client.get(user_key);
    const userData_meta = await client.get(user_meta_key);
    const user = { ...userData.bins, ...userData_meta.bins };
    try {
      return user;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async fetchSearchUser(search, handleUn) {
    return new Promise(async (resolve, reject) => {
      const exp = Aerospike.exp;
      const client = await getAerospikeClient();
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      const tempBin = "ExpVar"; // this bin is to hold expression read operation output
      const input_query = search;
      const search_query = search.slice(0, 2);

      query.where(Aerospike.filter.equal("s_t_u", search_query.toLowerCase()));

      const queryPolicy = new Aerospike.QueryPolicy({});

      queryPolicy.filterExpression = exp.cmpRegex(
        Aerospike.regex.ICASE | Aerospike.regex.NEWLINE,
        "^" + input_query,
        exp.binStr("handleUn")
      );
      var arr = [];
      const stream = query.foreach(queryPolicy);

      stream.on("data", function (record) {
        arr.push(record.bins);

        // console.log("*** User Search List ***")
        console.log(record.bins);
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (posts) {
        // console.log(arr);
        arr = arr.filter((user) => user.handleUn !== handleUn);
        resolve({ user: arr });
      });
    });
  }

  async fetchSuggestedUsers(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      // query.where(Aerospike.filter.equal("handleUn", handleUn));
      const queryPolicy = new Aerospike.QueryPolicy();
      query.select("u_id", "handleUn");
      const stream = query.foreach();
      var temp = [];

      stream.on("data", function (record) {
        if (record.bins.handleUn !== handleUn) {
          temp.push({ id: record.bins.u_id, display: record.bins.handleUn });
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        // var arr = temp.sort((a, b) => a.u_details.flwr_c - b.u_details.flwr_c);
        // console.log(temp);
        resolve(temp);
      });
    });
  }

  async updateInterest(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        id
      );

      const result = await client.exists(user_key);
      if (!result) {
        throw createError.BadRequest({ msg: "Invalid user id" });
      } else {
        var query = client.query(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS
        );
        const queryPolicy = new Aerospike.QueryPolicy();
        const stream = query.foreach();
        var user_obj = null;

        stream.on("data", function (record) {
          user_obj = record;
        });

        stream.on("error", function (error) {
          reject(error);
        });

        stream.on("end", function (record) {
          const ops = [Aerospike.operations.write("interest", data.selected)];
          client
            .operate(user_key, ops)
            .then(async (response) => {
              const data = await client.get(user_key);
              const token = jwt.sign({ data: data.bins }, "secret");
              resolve({
                msg: "User interest updated",
                user: data.bins,
                token: token,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    });
  }

  async fetchSuggestedUserOne(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      const arr = [];

      stream.on("data", function (record) {
        if (record.bins.handleUn !== handleUn) {
          arr.push(record.bins);
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        var temp = arr.sort((a, b) => b.flwr_c - a.flwr_c).splice(0, 10);
        resolve(temp);
      });
    });
  }

  async updateProfileHobbies(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );

      client
        .exists(user_key)
        .then((result) => {
          if (!result) {
            return res.status(400).json({ msg: "User not found" });
          } else {
            const ops = [
              Aerospike.operations.write("u_hobbies", JSON.parse(data.hobbies)),
            ];
            client.operate(user_key, ops, (err, result) => {
              if (err) {
                throw createError.BadRequest(err.message);
              } else {
                resolve({ msg: "Hobbies updated", result });
              }
            });
          }
        })
        .catch((err) => {
          throw createError.BadRequest(err.message);
        });
    });
  }

  async updateVerifyProfile(handleUn) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );

      client
        .exists(key)
        .then(async (data) => {
          if (!data) {
            return res.status(400).json({ msg: "Invalid user" });
          } else {
            const user = await client.get(key);
            var char = uuidv4();
            var result = char.slice(char.length - 6);
            const ops = [Aerospike.operations.write("v_code", result)];
            console.log(result);
            client
              .operate(key, ops)
              .then(async (data) => {
                console.log(data);
                const token = jwt.sign(
                  { handleUn: handleUn, keyCode: result },
                  "secret",
                  { expiresIn: "1h" }
                );
                console.log(token);
                const mailData = {
                  from: "noreply@test.com",
                  to: "goswami.avi14@gmail.com",
                  subject: "Profile Verification",
                  text: `Verify your profile by click on the below link`,
                  html: `<a href=http://localhost:3000/verify/${token}>Click here</a>`,
                };
                mg.messages().send(mailData, function (error, body) {
                  resolve({ msg: "Verification mail has been send" });
                });
              })
              .catch((err) => {
                throw createError.BadRequest(err.message);
              });
          }
        })
        .catch((err) => {
          throw createError.BadRequest(err.message);
        });
    });
  }

  async verifyProfileKey(id, handleUn) {
    const client = await getAerospikeClient();
    const verify = jwt.verify(id, "secret");
    console.log(verify);
    if (verify.handleUn === handleUn) {
      var key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        verify.handleUn
      );
      const user = await client.get(key);
      if (user.bins.v_code === verify.keyCode) {
        const ops = [Aerospike.operations.write("isVerified", true)];
        client
          .operate(key, ops)
          .then(async (data) => {
            const user = await client.get(key);
            return { msg: "Profile has been verified", user: user.bins };
          })
          .catch((err) => {
            throw createError.BadRequest(err.message);
          });
      }
    }
  }

  async getFullProfile(handleUn) {
    const client = await getAerospikeClient();
    var user = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUn
    );
    const user_meta = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USER_META,
      handleUn
    );
    const userData = await client.get(user);
    const userMetaData = await client.get(user_meta);

    const result = { ...userData.bins, ...userMetaData.bins };
    return result;
  }

  async fetchSuggestedUserTwo(handleUn, page, limit) {
    return new Promise(async (resolve, reject) => {
      const batchType = Aerospike.batchType;
      const client = await getAerospikeClient();
      let query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      const tempBin = "ExpVar";
      query.select("fn", "ln", "p_i", "handleUn", "flwr_c"); //select single bin
      const stream = query.foreach();
      var users = [];

      stream.on("data", function (record) {
        if (handleUn !== record.bins.handleUn) {
          users.push(record.bins);
        }
      });

      stream.on("error", function (error) {
        reject(error);
      });

      stream.on("end", function (record) {
        users = users.sort((a, b) => b.flwr_c - a.flwr_c);
        // var page = req.query.page || 1;
        // var limit = req.query.limit || 5;
        var start = (page - 1) * limit;
        var end = page * limit;
        var count = 0;
        users = users.slice(start, end);
        resolve(users);
      });
    });
  }

  async updateUserInfo(handleUn, data) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );

      query.where(Aerospike.filter.equal("handleUn", handleUn));
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      var user_obj = null;
      stream.on("data", function (record) {
        user_obj = record.bins;
      });

      stream.on("end", function (record) {
        const name = data.name.split(" ");
        const ops = [
          Aerospike.operations.write("fn", name[0]),
          Aerospike.operations.write("ln", name[1] || ""),
          Aerospike.operations.write("log_un", data.log_un),
          Aerospike.operations.write("gen", data.gender),
        ];
        client
          .operate(user_key, ops)
          .then(async (response) => {
            const data = await client.get(user_key);
            const token = jwt.sign({ data: data.bins }, "secret");
            resolve({
              msg: "User info updated",
              user: data.bins,
              token: token,
            });
          })
          .catch((err) => {
            throw createError.BadRequest(err.message);
          });
      });
    });
  }

  async updateUserInterestInfo(id, data) {
    return new Promise(async (resolve, reject) => {
      console.log(data);
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        id
      );
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      // query.where(Aerospike.filter.equal("handleUn", req.body.handleUn));
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      var user_obj = null;
      stream.on("data", function (record) {
        user_obj = record;
      });
      stream.on("end", function (record) {
        const ops = [Aerospike.operations.write("interest", data.selected)];
        client
          .operate(user_key, ops)
          .then(async (response) => {
            const data = await client.get(user_key);
            const token = jwt.sign({ data: data.bins }, "secret");
            resolve({
              msg: "User interest updated",
              user: data.bins,
              token: token,
            });
          })
          .catch((err) => {
            console.log(err);
            throw createError.BadRequest(err.message);
          });
      });
    });
  }

  async updateAndSetUserInfo(id) {
    return new Promise(async (resolve, reject) => {
      const client = await getAerospikeClient();
      const user_key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        id
      );
      // const result = await client.exists(user_key);
      var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
      // query.where(Aerospike.filter.equal("handleUn", req.body.handleUn));
      const queryPolicy = new Aerospike.QueryPolicy();
      const stream = query.foreach();
      var user_obj = null;

      stream.on("data", function (record) {
        user_obj = record;
      });

      stream.on("end", function (record) {
        client
          .get(user_key)
          .then((data) => {
            const token = jwt.sign({ data: data.bins }, "secret");
            resolve({
              msg: "User interest updated",
              user: data.bins,
              token: token,
            });
          })
          .catch((err) => {
            return res.status(500).json({ msg: err.message });
          });
      });
    });
  }

  async getGCMBatch(handleUn, value) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUn
    );
    const data = await client.get(key);
    const user = data.bins;
    if (
      user.flwr_c === Number("1") &&
      user.post_c === Number("1") &&
      user.isVerified
    ) {
      const ops = [Aerospike.lists.append("badge", "gcm")];
      client
        .operate(key, ops)
        .then((data) => {
          return { msg: "You get GCM badge", data };
        })
        .catch((err) => {
          throw createError.BadRequest(err.message);
        });
    } else {
      const ops = [Aerospike.lists.removeByValue("badge", "gcm")];
      client
        .operate(key, ops)
        .then((data) => {
          return { msg: "Your GCM badge has been removed", data };
        })
        .catch((err) => {
          throw createError.BadRequest(err.message);
        });
    }
  }

  async getMBBatch(handleUn, badge) {
    if (badge === "cc") {
      const client = await getAerospikeClient();
      const key = new Aerospike.Key(
        process.env.CLUSTER_NAME,
        process.env.SET_USERS,
        handleUn
      );
      const data = await client.get(key);
      const user = data.bins;
      if (
        user.flwr_c === Number("1") &&
        user.post_c === Number("1") &&
        user.isVerified
      ) {
        const ops = [Aerospike.lists.append("badge", "mb")];
        client
          .operate(key, ops)
          .then((data) => {
            return res.status(200).json({ msg: "You get M&B badge", data });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err.message });
          });
      } else {
        const ops = [Aerospike.lists.removeByValue("badge", "mb")];
        client
          .operate(key, ops)
          .then((data) => {
            return res
              .status(200)
              .json({ msg: "Your M&B badge has been removed", data });
          })
          .catch((err) => {
            return res.status(400).json({ msg: err.message });
          });
      }
    }
  }

  async getCheckBadges(handleUn) {
    const client = await getAerospikeClient();
    const key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUn
    );
    const data = await client.get(key);
    const user = data.bins;
    // Check GCM BADGES
    if (
      process.env.FLWR_COUNT_FOR_GCM > user.flwr_c ||
      process.env.POSTNO_FOR_GCM > user.post_c ||
      !user.isVerified
    ) {
      console.log("GCM");
      const ops = [Aerospike.lists.removeByValue("badge", "gcm")];
      const data = await client.operate(key, ops);
      try {
        return { msg: "Remove" };
      } catch (err) {
        throw createError.BadRequest(err.message);
      }
    }

    // Check CONTENT CREATOR BADGES
    else if (
      process.env.FLWR_COUNT_FOR_CC > user.flwr_c ||
      process.env.POSTNO_FOR_CC > user.post_c ||
      !user.isVerified
    ) {
      console.log("CC");
      const ops = [Aerospike.lists.removeByValue("badge", "cc")];
      const data = await client.operate(key, ops);
      try {
        return { msg: "Remove" };
      } catch (err) {
        throw createError.BadRequest(err.message);
      }
    }

    // Check M&B BADGES
    else if (
      process.env.FLWR_COUNT_FOR_MINER < user.flwr_c ||
      process.env.POSTNO_FOR_MINER > user.post_c ||
      !user.isVerified
    ) {
      console.log("CC");
      const ops = [Aerospike.lists.removeByValue("badge", "cc")];
      const data = await client.operate(key, ops);
      try {
        return { msg: "Remove" };
      } catch (err) {
        throw createError.BadRequest(err.message);
      }
    }
  }
}

module.exports = new UserModal();

// throw createError.BadRequest(err.message);
