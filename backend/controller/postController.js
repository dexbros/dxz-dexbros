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
const { uploadImage } = require("../helper/uploadBucket");
const {
  socialBookmarkPost,
  socialPinnedPost,
  socialCreatePost,
  socialBookmark,
  socialHidePost,
  socialPostEdit,
  socialPostSpam,
  socialNewsFetch,
  socialfetchUserRelatedPosts,
  userProfilePosts,
  socialTreandingWords,
  socialDonatNft,
  socialDonationHistory,
  fetchDonationDetails,
  socialSharePost,
  socialSharePostPrivacy,
  socialCommentPostPrivacy,
  socialPostToNft,
  socialFetchFullPost,
  socialPinnedComment,
  socialDeleteComment,
  socialEditComment,
  socialSpamComment,
  socialLikeComment,
  socialRemoveLikeComment,
  createSocialComment,
  fetchSocialComments,
  fetchSocialMyComments,
  socialCreatReply,
  socialFetchCommentReply,
  socialHideReply,
  socialDeleteReply,
  socialLikeReply,
  createSocialNewPost,
  fetchSocialPostWithComment,
  createPostComment,
  SocialEmojiRemoveLike,
  updatePostViewCount,
} = require("../model/postModel");

class PostController {
  constructor() {
    // console.log("Post controller init");
  }

  // *** Update post count
  async updateViewCount(req, res, next) {
    try {
      const data = await updatePostViewCount(req.body);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  // *** Create new post
  async createNewPost(req, res, next) {
    console.log("Create post ");
    try {
      const data = await createSocialNewPost(
        req.user,
        req.body,
        req.file,
        req.query
      );
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Pinned Post
  async pinnedPost(req, res, next) {
    try {
      const data = await socialPinnedPost(req.params.id);
      try {
        res.status(200).json(data.bins);
      } catch (error) {
        throw createError.Conflict(error.message);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Bookmark post
  async bookmarkPost(req, res, next) {
    try {
      const data = await socialBookmark(req.params.id, req.user.handleUn);
      try {
        res.status(200).json(data.bins);
      } catch (error) {
        throw createError.Conflict(error.message);
      }
    } catch (error) {
      next(error.message);
    }
  }

  // *** Hide post
  async hidePost(req, res, next) {
    try {
      // const client = await getAerospikeClient();
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
      } else {
        const data = await socialHidePost(req.params.id, req.user.handleUn);
        try {
          res.status(200).json(data.bins);
        } catch (error) {
          throw createError.Conflict(error.message);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch post analytics
  async fetchPostAnalytics(req, res, next) {
    console.log("Came in backend");
    // try {
    //   const client = await getAerospikeClient();
    //   if (!req.params.id) {
    //     throw createError.Conflict("Post id is not present in parameter");
    //   } else {
    //     console.log(req.params.id);
    //     const post_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_POSTS,
    //       req.params.id
    //     );
    //     const post_meta_key = new Aerospike.Key(
    //       process.env.CLUSTER_NAME,
    //       process.env.SET_POSTS_META,
    //       req.params.id
    //     );

    //     var post;

    //     client.exists(post_key, async (err, result) => {
    //       if (err) {
    //         throw createError.BadRequest(err.message);
    //       } else {
    //         if (!result) {
    //           throw createError.BadRequest(err.message);
    //         } else {
    //           const mapOps = [
    //             Aerospike.maps
    //               .getByKey("analytics", req.query.date)
    //               .andReturn(maps.returnType.KEY_VALUE),
    //           ];
    //           client.operate(post_meta_key, mapOps, async (err, result) => {
    //             const post = await client.get(post_meta_key);
    //             if (err) {
    //               throw createError.BadRequest(err.message);
    //             } else {
    //               console.log({
    //                 metaData: post,
    //                 analytics: result.bins.analytics,
    //               });
    //               return res
    //                 .status(200)
    //                 .json({ metaData: post, analytics: result.bins.analytics });
    //             }
    //           });
    //         }
    //       }
    //     });
    //   }
    // } catch (error) {
    //   next(error);
    // }
  }

  // *** Post edit
  async postEdit(req, res, next) {
    try {
      // const client = await getAerospikeClient();
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
      } else {
        const data = await socialPostEdit(req.body, req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Post delete
  async deletePost(req, res, next) {
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
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
                  throw createError.BadRequest(err.message);
                } else {
                  return res.status(200).json({ msg: "Post deleted" });
                }
              });
            }
          })
          .catch((err) => {
            throw createError.BadRequest(err.message);
          });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Post spam
  async spamPost(req, res) {
    try {
      const client = await getAerospikeClient();
      var incrmentedBy = 0;

      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
      } else {
        const data = await socialPostSpam(req.params.id, req.user.handleUn);
        return res.status(200).json({ msg: "success" });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch news
  async fetchNews(req, res, next) {
    try {
      const data = await socialNewsFetch();
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch feed posts
  async fetchFeedPost(req, res, next) {
    console.log(req.query);
    try {
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
        if (req.query.sort === "all") {
          console.log(arr);
          return res.status(200).json(arr);
        } else if (req.query.sort === "np") {
          const temp = arr.filter((data) => data.postOf === "np");
          return res.status(200).json(temp);
        } else if (req.query.sort === "news") {
          const temp = arr.filter((data) => data.postOf === "news");
          return res.status(200).json(temp);
        } else if (req.query.sort === "anc") {
          const temp = arr.filter((data) => data.postOf === "anc");
          return res.status(200).json(temp);
        } else if (req.query.sort === "info") {
          const temp = arr.filter((data) => data.postOf === "info");
          return res.status(200).json(temp);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch for you feed posts
  async fetchForYouFeedPost(req, res, next) {
    console.log("LOOK");
    try {
      const data = await socialfetchUserRelatedPosts(req.query);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch user related posts
  async fetchUserRelatedPosts(req, res, next) {
    try {
      console.log(">>>>>>>");
      const handleUn = req.params.handleUn;
      // const client = await getAerospikeClient();
      if (!handleUn) {
        throw createError.BadRequest("User handle name is not present");
      } else {
        const data = await userProfilePosts(req.user.handleUn, req.query);
        return res.status(200).json({ posts: data });
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch all trending key words
  async fetchTrendingWords(req, res, next) {
    try {
      const data = await socialTreandingWords();

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch trending post
  async fetchTrendingPosts(req, res, next) {
    try {
      const client = await getAerospikeClient();
      const term = `#${req.query.key}`;

      let query = client.query(
        process.env.CLUSTER_NAME,
        process.env.SET_TRENDING
      );
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
        client.batchRead(temp, async (err, results) => {
          if (err) {
            throw createError.BadRequest(err.message);
          } else {
            posts = results;
            return res.status(200).json(posts);
          }
        });
      });
    } catch (error) {
      next(error);
    }
  }

  // *** Donate nft to the user
  async donateNft(req, res, next) {
    console.log("CALL DONATE");
    try {
      const client = await getAerospikeClient();

      console.log(req.query);
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in the parameter");
      } else {
        const id = req.params.id;
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
              throw createError.BadRequest(err.message);
            } else {
              if (!result) {
                throw createError.BadRequest("No post found");
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

                      client.operate(
                        post_meta_key,
                        ops,
                        async (err, result) => {
                          if (err) {
                            throw createError.BadRequest(err.message);
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
                              let data = await client.operate(
                                post_meta_key,
                                ops
                              );
                              try {
                                return res.status(200).json({ msg: "Success" });
                              } catch (error) {
                                throw createError.BadRequest(error.message);
                              }
                            } else {
                              const ops = [
                                Aerospike.maps.put(
                                  "earn",
                                  time,
                                  req.query.amount,
                                  {
                                    order: maps.order.KEY_ORDERED,
                                  }
                                ),
                              ];
                              let result = await client.operate(
                                post_meta_key,
                                ops
                              );
                              try {
                                let result = await client.operate(
                                  user_meta_key,
                                  ops
                                );
                                try {
                                  return res
                                    .status(200)
                                    .json({ msg: "Success" });
                                } catch (error) {
                                  throw createError.BadRequest(error.message);
                                }
                              } catch (error) {
                                throw createError.BadRequest(error.message);
                              }
                            }
                          }
                        }
                      );
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
                          throw createError.BadRequest(error.message);
                        }
                      } catch (error) {
                        throw createError.BadRequest(error.message);
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
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch donation history
  async fetchDonationHistory(req, res, next) {
    console.log(">>>>");
    try {
      const client = await getAerospikeClient();
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
      } else {
        const data = await socialDonationHistory(req.params.id);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch single donation details
  async fetchSingleDonationDetails(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.Conflict("Post id is not present in parameter");
      } else {
        const data = await fetchDonationDetails(req.params.id);
        // console.log(">>> ", data);
        return res.status(200).json(data.bins);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Create and save nft post
  async createNft(req, res, next) {
    try {
      console.log(req.body);
    } catch (error) {
      next(error);
    }
  }

  // *** Share social post
  async sharePost(req, res, next) {
    console.log(req.body);
    const client = await getAerospikeClient();
    try {
      const data = await socialSharePost(req.params.id, req.body, req.user);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Update post share privacy settings
  async sharePostPrivacy(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Post id is not present in params");
      } else {
        const data = await socialSharePostPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Update post comment privacy settings
  async commentPostPrivacy(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Post id is not present in params");
      } else {
        const data = await socialCommentPostPrivacy(req.params.id, req.body);
        return res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  // *** Social post emoji LIKE
  async emojiLikePost(req, res, next) {
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

                const postUpdates = {
                  postId: id,
                  postLikeCount: 5,
                };
                console.log(postUpdates);
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
  }

  async emojiERemoveLikePost(req, res, next) {
    try {
      const data = await SocialEmojiRemoveLike(
        req.user.handleUn,
        req.params.id
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Socail post emoji DISLIKE
  async emojiDislikePost(req, res, next) {
    const client = await getAerospikeClient();
    const id = req.params.id;
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
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
                            } else {
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
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
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
                            } else {
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
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
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
                            } else {
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
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
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
                            } else {
                              return res.status(200).json({
                                msg: "Dislike post",
                                notificationData,
                              });
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
  }

  // *** Socail post emoji HAHA
  async emojiHahaPost(req, res, next) {
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
                  const ops = [
                    Aerospike.lists.append("haha", req.user.handleUn),
                  ];
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
  }

  // *** Social post emoji Angry
  async emojiAngryPost(req, res, next) {
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
  }

  // *** Fetch all users who like the post
  async fetchLikedUsers(req, res, next) {
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
  }

  // *** Helpfull Information post
  async postHelpfulInfo(req, res, next) {
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
      } else if (
        data.bins.misld &&
        data.bins.misld.includes(req.user.handleUn)
      ) {
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
  }

  // *** Unhelpfull Information post
  async unHelpfulInfo(req, res, next) {
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
            const ops = [
              Aerospike.lists.append("unhlpfull", req.user.handleUn),
            ];
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
  }

  // *** Misleading Information post
  async misleadingInfo(req, res, next) {
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
      } else if (
        data.bins.unhlp &&
        data.bins.unhlp.includes(req.user.handleUn)
      ) {
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
                const ops = [
                  Aerospike.lists.append("misld", req.user.handleUn),
                ];
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
  }

  // *** Like announcement
  async likeAnnouncement(req, res, next) {
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
  }

  // *** Importent announcement
  async importentAnnouncement(req, res, next) {
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
            const ops = [
              Aerospike.lists.removeByValue("imp", req.user.handleUn),
            ];
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
  }

  // *** Scam announcement
  async scamAnnouncement(req, res, next) {
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
  }

  // *** Reliable news
  async reliableNews(req, res, next) {
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
        const ops = [
          Aerospike.lists.removeByValue("intrst", req.user.handleUn),
        ];
        client.operate(post_meta_key, ops, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: err.message });
          } else {
            const ops = [Aerospike.operations.incr("intrst_c", -1)];
            client.operate(post_key, ops, (err, result) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              } else {
                const ops = [
                  Aerospike.lists.append("relib", req.user.handleUn),
                ];
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
                const ops = [
                  Aerospike.lists.append("relib", req.user.handleUn),
                ];
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
  }

  // *** Interesting news
  async interstingNew(req, res, next) {
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
        const ops = [
          Aerospike.lists.removeByValue("intrst", req.user.handleUn),
        ];
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
      } else if (
        data.bins.relib &&
        data.bins.relib.includes(req.user.handleUn)
      ) {
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
                const ops = [
                  Aerospike.lists.append("intrst", req.user.handleUn),
                ];
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
                const ops = [
                  Aerospike.lists.append("intrst", req.user.handleUn),
                ];
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
  }

  // *** Fake news
  async fakeNews(req, res, next) {
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
      } else if (
        data.bins.relib &&
        data.bins.relib.includes(req.user.handleUn)
      ) {
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
        const ops = [
          Aerospike.lists.removeByValue("intrst", req.user.handleUn),
        ];
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
  }

  // **** Search post
  async searchPost(req, res, next) {
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
    // const data = await socialSearchPost(req.query);
    // return res.status(200).json({ posts: data });
  }

  // Repost post
  async repostPost(req, res, next) {
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
  }

  // *** fetch post for creating NFT
  async fetchPostToCreatNft(req, res, next) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const data = await socialPostToNft(req.params.id);
      return res.status(200).json(data);
    }
    // throw createError.Conflict(error.message);
  }

  // *** Fetch full post
  async fetchFullPost(req, res, next) {
    console.log("....");
    const data = await socialFetchFullPost(req.params.id);
    return res.status(200).json(data);
  }

  async fetchFullPostWithComment(req, res, next) {
    try {
      const sortedBy = req.query.sortedBy || "pop";
      const page = req.query.page || 1;
      const limit = req.query.limit || 5;

      const data = await fetchSocialPostWithComment(
        req.user.handleUn,
        req.params.id,
        page,
        limit,
        sortedBy
      );

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /***
   * @SOCIAL_POST_COMMENT
   */
  async createComment(req, res, next) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    // else {
    //   // *** Create post key (FEED)
    //   const post_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POSTS,
    //     req.params.id
    //   );
    //   const post = await client.get(post_key);
    //   const post_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POSTS_META,
    //     req.params.id
    //   );
    //   // *** Create post key (MAIN)
    //   const main_post_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_MAIN_POSTS,
    //     req.params.id
    //   );
    //   // *** Create post comment key
    //   const post_comment_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POST_COMMENT,
    //     comment_id
    //   );
    //   // *** Create post meta comment key
    //   const post_comment_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POST_COMMENT_META,
    //     comment_id
    //   );
    //   let batchPolicy1 = new Aerospike.BatchPolicy({});
    //   var batchArrKeys = [];
    //   batchArrKeys = [
    //     post_comment_key,
    //     post_comment_meta_key,
    //     main_post_key,
    //     post_key,
    //     post_meta_key,
    //   ];
    //   var batchRecords = [];
    //   if (!req.file) {
    //     for (let i = 0; i < batchArrKeys.length; i++) {
    //       console.log("SET NAME: ", batchArrKeys[i].set);
    //       if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
    //         batchRecords.push({
    //           type: batchType.BATCH_WRITE,
    //           key: batchArrKeys[i],
    //           ops: [
    //             Aerospike.operations.write("id", comment_id),
    //             Aerospike.operations.write("comment", req.body.comment || ""),
    //             Aerospike.operations.write("gif", req.body.gif || ""),
    //             Aerospike.operations.write("l_c", 0),
    //             Aerospike.operations.write("d_c", 0),
    //             Aerospike.operations.write("s_c", 0),
    //             Aerospike.operations.write("hide", 0),
    //             Aerospike.operations.write("c_t", new Date().getTime()),
    //             Aerospike.operations.write("u_t", new Date().getTime()),
    //             Aerospike.operations.write("c_fn", req.user.fn),
    //             Aerospike.operations.write("c_ln", req.user.ln),
    //             Aerospike.operations.write("c_u_du", req.user.handleUn),
    //             Aerospike.operations.write("c_u_img", req.user.p_i),
    //             Aerospike.operations.write("pinn", false),
    //             Aerospike.operations.write("delete", false),
    //             Aerospike.operations.write("reply_c", 0),
    //             Aerospike.operations.write("postId", req.params.id),
    //           ],
    //         });
    //       } else if (
    //         batchArrKeys[i].set === process.env.SET_POST_COMMENT_META
    //       ) {
    //         batchRecords.push({
    //           type: batchType.BATCH_WRITE,
    //           key: batchArrKeys[i],
    //           ops: [
    //             Aerospike.operations.write("id", comment_id),
    //             Aerospike.operations.write("likes", []),
    //             Aerospike.operations.write("dislikes", []),
    //             Aerospike.operations.write("haha", []),
    //             Aerospike.operations.write("angry", []),
    //             Aerospike.operations.write("spam", []),
    //           ],
    //         });
    //       } else if (batchArrKeys[i].set === process.env.SET_POSTS) {
    //         batchRecords.push({
    //           type: batchType.BATCH_WRITE,
    //           key: batchArrKeys[i],
    //           ops: [Aerospike.operations.incr("c_c", 1)],
    //         });
    //       } else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
    //         batchRecords.push({
    //           type: batchType.BATCH_WRITE,
    //           key: batchArrKeys[i],
    //           ops: [Aerospike.operations.incr("c_c", 1)],
    //         });
    //       } else if (batchArrKeys[i].set === process.env.SET_POSTS_META) {
    //         batchRecords.push({
    //           type: batchType.BATCH_WRITE,
    //           key: batchArrKeys[i],
    //           ops: [Aerospike.operations.incr("cmnts", +1)],
    //         });
    //       }
    //     }
    //     await client.batchWrite(batchRecords, batchPolicy1);
    //     const data = await client.get(post_comment_key);
    //     try {
    //       if (req.user.handleUn !== post.bins.u_dun) {
    //         // *** save notification data
    //         const map_key = new Aerospike.Key(
    //           process.env.CLUSTER_NAME,
    //           process.env.SET_APP_HISTORY,
    //           post.bins.u_dun
    //         );
    //         const notificationData = {
    //           id: req.params.id,
    //           ty: 2,
    //           vi: false,
    //           wo: req.user.handleUn,
    //           ti: Date.now(),
    //           nm: `${req.user.fn} ${req.user.ln}`,
    //           pi: req.user.p_i,
    //           re: post.bins.u_dun,
    //         };
    //         const map_ops = [
    //           Aerospike.operations.write("n_id", post.bins.u_dun),
    //           Aerospike.maps.put("notification", Date.now(), notificationData, {
    //             order: maps.order.KEY_ORDERED,
    //           }),
    //           Aerospike.operations.incr("count", 1),
    //         ];
    //         let result = await client.operate(map_key, map_ops);
    //         return res
    //           .status(200)
    //           .json({ comment: data.bins, notificationData });
    //       } else {
    //         return res.status(200).json(data.bins);
    //       }
    //     } catch (error) {
    //       return res.status(400).json({ msg: error.message });
    //     }
    //   } else {
    //     const newImageName = req.file.originalname;
    //     const blob = bucket.file(newImageName);
    //     const blobStream = blob.createWriteStream();
    //     blobStream.on("error", (err) => {
    //       console.log(err);
    //       return res.status(400).json({ msg: err.message });
    //     });
    //     blobStream.on("finish", async () => {
    //       var publicURL = `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${blob.name}`;
    //       for (let i = 0; i < batchArrKeys.length; i++) {
    //         if (batchArrKeys[i].set === process.env.SET_POST_COMMENT) {
    //           batchRecords.push({
    //             type: batchType.BATCH_WRITE,
    //             key: batchArrKeys[i],
    //             ops: [
    //               Aerospike.operations.write("id", comment_id),
    //               Aerospike.operations.write("comment", req.body.comment || ""),
    //               Aerospike.operations.write("img", publicURL),
    //               Aerospike.operations.write("gif", req.body.gif || ""),
    //               Aerospike.operations.write("l_c", 0),
    //               Aerospike.operations.write("d_c", 0),
    //               Aerospike.operations.write("s_c", 0),
    //               Aerospike.operations.write("hide", 0),
    //               Aerospike.operations.write("c_t", new Date().getTime()),
    //               Aerospike.operations.write("u_t", new Date().getTime()),
    //               Aerospike.operations.write("c_fn", req.user.fn),
    //               Aerospike.operations.write("c_ln", req.user.ln),
    //               Aerospike.operations.write("c_u_du", req.user.handleUn),
    //               Aerospike.operations.write("c_u_img", req.user.p_i),
    //               Aerospike.operations.write("pinn", false),
    //               Aerospike.operations.write("delete", false),
    //               Aerospike.operations.write("reply_c", 0),
    //               Aerospike.operations.write("postId", req.params.id),
    //             ],
    //           });
    //         } else if (
    //           batchArrKeys[i].set === process.env.SET_POST_COMMENT_META
    //         ) {
    //           batchRecords.push({
    //             type: batchType.BATCH_WRITE,
    //             key: batchArrKeys[i],
    //             ops: [
    //               Aerospike.operations.write("id", comment_id),
    //               Aerospike.operations.write("likes", []),
    //               Aerospike.operations.write("dislikes", []),
    //               Aerospike.operations.write("haha", []),
    //               Aerospike.operations.write("angry", []),
    //               Aerospike.operations.write("spam", []),
    //             ],
    //           });
    //         } else if (batchArrKeys[i].set === process.env.SET_POSTS) {
    //           batchRecords.push({
    //             type: batchType.BATCH_WRITE,
    //             key: batchArrKeys[i],
    //             ops: [Aerospike.operations.incr("c_c", 1)],
    //           });
    //         } else if (batchArrKeys[i].set === process.env.SET_MAIN_POSTS) {
    //           batchRecords.push({
    //             type: batchType.BATCH_WRITE,
    //             key: batchArrKeys[i],
    //             ops: [Aerospike.operations.incr("c_c", 1)],
    //           });
    //         } else if (batchArrKeys[i].set === process.env.SET_POSTS_META) {
    //           batchRecords.push({
    //             type: batchType.BATCH_WRITE,
    //             key: batchArrKeys[i],
    //             ops: [Aerospike.operations.incr("cmnts", +1)],
    //           });
    //         }
    //       }
    //       await client.batchWrite(batchRecords, batchPolicy1);
    //       try {
    //         const data = await client.get(post_comment_key);
    //         try {
    //           // ***** ADD ***** //
    //           var analytics_key = `${new Date().getDate()}-${
    //             new Date().getMonth() + 1
    //           }-${new Date().getFullYear()}`;
    //           const map = {
    //             likes: post.bins.l_c,
    //             comments: post.bins.c_c + 1,
    //             shares: post.bins.share_c,
    //           };
    //           let mapOps = [
    //             maps.put("analytics", analytics_key, map, {
    //               order: maps.order.KEY_ORDERED,
    //             }),
    //           ];
    //           let result = await client.operate(post_meta_key, mapOps);
    //           // *** Send post comment notification
    //           if (req.user.handleUn !== post.bins.u_dun) {
    //             // *** save notification data
    //             const map_key = new Aerospike.Key(
    //               process.env.CLUSTER_NAME,
    //               process.env.SET_APP_HISTORY,
    //               post.bins.u_dun
    //             );
    //             const notificationData = {
    //               id: req.params.id,
    //               ty: 2,
    //               vi: false,
    //               wo: req.user.handleUn,
    //               ti: Date.now(),
    //               nm: `${req.user.fn} ${req.user.ln}`,
    //               pi: req.user.p_i,
    //               re: post.bins.u_dun,
    //             };
    //             const map_ops = [
    //               Aerospike.operations.write("n_id", post.bins.u_dun),
    //               Aerospike.maps.put(
    //                 "notification",
    //                 Date.now(),
    //                 notificationData,
    //                 {
    //                   order: maps.order.KEY_ORDERED,
    //                 }
    //               ),
    //               Aerospike.operations.incr("count", 1),
    //             ];
    //             return res
    //               .status(200)
    //               .json({ comment: data.bins, notificationData });
    //           } else {
    //             return res.status(200).json(data.bins);
    //           }
    //         } catch (error) {
    //           return res.status(400).json({ msg: error.message });
    //         }
    //       } catch (error) {
    //         return res.status(400).json({ msg: error.message });
    //       }
    //     });
    //     blobStream.end(req.file.buffer);
    //   }
    // }
    else {
      const data = await createPostComment(
        req.params.id,
        req.user,
        req.body,
        req.file,
        req.query
      );
      return res.status(200).json(data);
    }
  }

  // *** Fetch single comment
  async fetchsingleComment(req, res, next) {
    try {
      const data = await fetchSocialComments(
        req.params.id,
        req.user.handleUn,
        req.query.sortedBy,
        req.query.page,
        req.query.limit
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Fetch user comment
  async fetchMyComments(req, res, next) {
    try {
      const data = await fetchSocialMyComments(
        req.params.id,
        req.user.handleUn,
        req.query.sortedBy,
        req.query.page,
        req.query.limit
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  // *** Pinned comment
  async pinnedComment(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const data = await socialPinnedComment(req.params.id);
      return res.status(200).json(data);
    }
  }

  // *** Delete comment
  async deleteComment(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const data = await socialDeleteComment(req.params.id);
      return res.status(200).json(data);
    }
  }

  // *** Edit comment
  async editComment(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const data = await socialEditComment(req.params.id, req.body);
      return res.status(200).json(data);
    }
  }

  // *** Comment dilike
  async commentDislike(req, res, next) {}

  // *** Comment haha
  async commentHaha(req, res, next) {}

  // *** Comment Angry
  async commentAngry(req, res, next) {}

  // *** Spam comment
  async spamComment(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      console.log(req.params.id);
      const data = await socialSpamComment(req.params.id, req.user.handleUn);
      console.log(data);
      return res.status(200).json(data);
    }
  }

  // *** Comment Like
  async commentLike(req, res, next) {
    if (!req.params.id || !req.params.username || !req.params.type) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const data = await socialLikeComment(
        req.params.id,
        req.params.username,
        req.params.type,
        req.user
      );
      console.log(data);
      return res.status(200).json(data);
    }
  }

  // *** Comment like remove
  async commentLikeRemove(req, res, next) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid parameter" });
    } else {
      const data = await socialRemoveLikeComment(
        req.params.id,
        req.user.handleUn
      );
      return res.status(200).json(data);
    }
  }

  /**
   * @POST_COMMENT_REPLY
   */

  // *** create comment reply
  async createReply(req, res, data) {
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid request" });
    } else {
      const data = await socialCreatReply(req.params.id, req.body, req.user);
      return res.status(200).json(data);
    }
  }

  // *** Fetch comment reply
  async fetchReplies(req, res, next) {
    console.log(">>>>");
    const client = await getAerospikeClient();
    const batchType = Aerospike.batchType;
    if (!req.params.id) {
      return res.status(400).json({ msg: "Invalid" });
    } else {
      // let query = client.query(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_POST_REPLY
      // );
      // const tempBin1 = "ExpVar";
      // query.where(Aerospike.filter.equal("cmntId", req.params.id));
      // const stream = query.foreach();
      // const arr = [];
      // stream.on("data", function (record) {
      //   console.log(record.bins.cmntId, req.params.id);
      //   arr.push(record.bins);
      // });

      // stream.on("end", function (record) {
      //   // console.log(arr);
      //   const page = req.query.page;
      //   const limit = req.query.limit;
      //   const sortedBy = req.query.sortedBy;
      //   var start = (page - 1) * limit;
      //   var end = page * limit;
      //   // var temp = arr.sort((a, b) => a.id - b.id)
      //   var data = arr.slice(start, end);
      //   return res.status(200).json(arr);
      // });
      const data = await socialFetchCommentReply(
        req.params.id,
        req.query.page,
        req.query.limit
      );
      console.log("DATA: ", data);
      return res.status(200).json(data);
    }
  }

  // **** Hide comment replies
  async hideReply(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      // const post_comment_reply_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_POST_REPLY,
      //   req.params.id
      // );
      // const post_comment_reply_meta_key = new Aerospike.Key(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_POST_REPLY_META,
      //   req.params.id
      // );
      // let query = client.query(
      //   process.env.CLUSTER_NAME,
      //   process.env.SET_POST_REPLY_META
      // );
      // const tempBin1 = "ExpVar";
      // query.where(Aerospike.filter.equal("id", req.params.id));
      // const stream = query.foreach();
      // var data;
      // stream.on("data", function (record) {
      //   data = record.bins;
      // });
      // stream.on("end", function (record) {
      //   if (data.spam.includes(req.user.handleUn)) {
      //     const ops = [
      //       Aerospike.lists.removeByValue("spam", req.user.handleUn),
      //     ];
      //     client.operate(post_comment_reply_meta_key, ops, (err, result) => {
      //       if (err) {
      //         return res.status(400).json({ msg: err.message });
      //       } else {
      //         const ops = [Aerospike.operations.incr("s_c", -1)];
      //         client.operate(post_comment_reply_key, ops, (err, result) => {
      //           if (err) {
      //             return res.status(400).json({ msg: err.message });
      //           } else {
      //             return res.status(200).json({ msg: "Reply spam removed" });
      //           }
      //         });
      //       }
      //     });
      //   } else {
      //     const ops = [Aerospike.lists.append("spam", req.user.handleUn)];
      //     client.operate(post_comment_reply_meta_key, ops, (err, result) => {
      //       if (err) {
      //         return res.status(400).json({ msg: err.message });
      //       } else {
      //         const ops = [Aerospike.operations.incr("s_c", 1)];
      //         client.operate(post_comment_reply_key, ops, (err, result) => {
      //           if (err) {
      //             return res.status(400).json({ msg: err.message });
      //           } else {
      //             return res.status(200).json({ msg: "Reply spam" });
      //           }
      //         });
      //       }
      //     });
      //   }
      // });

      const data = await socialHideReply(req.params.id, req.user.handleUn);
      return res.status(200).json(data);
    }
  }

  // *** Spam reply
  async spamReply(req, res, next) {
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
          const ops = [
            Aerospike.lists.removeByValue("spam", req.user.handleUn),
          ];
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
  }

  // *** Delete reply
  async deleteReply(req, res, next) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const data = await socialDeleteReply(req.params.id);
      return res.status(200).json(data);
    }
  }

  // reply dislike
  async dislikeReply(req, res, next) {
    // const client = await getAerospikeClient();
    // if (!req.params.id) {
    //   return res.status(401).json({ msg: "Invalid request" });
    // } else {
    //   const post_comment_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POST_REPLY,
    //     req.params.id
    //   );
    //   const post_comment_meta_key = new Aerospike.Key(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POST_REPLY_META,
    //     req.params.id
    //   );
    //   let query = client.query(
    //     process.env.CLUSTER_NAME,
    //     process.env.SET_POST_REPLY_META
    //   );
    //   const tempBin1 = "ExpVar";
    //   query.where(Aerospike.filter.equal("id", req.params.id));
    //   const stream = query.foreach();
    //   var data;
    //   stream.on("data", function (record) {
    //     data = record.bins;
    //   });
    //   stream.on("end", function (record) {
    //     console.log(data);
    //   });
    // }
  }

  // Like reply
  async likeReply(req, res) {
    const client = await getAerospikeClient();
    if (!req.params.id) {
      return res.status(401).json({ msg: "Invalid request" });
    } else {
      const data = await socialLikeReply(req.params.id, req.user);
    }
  }
}

module.exports = new PostController();
