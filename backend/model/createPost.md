<!-- @format -->

async createSocialNewPost(user, data, file, query) {

    <!-- 1. Here We are going to check If REQ.BODY.CONTENT contains any url link or not -->
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

    <!-- 2. Create post timestamp id -->
    const post_id = now.micro();

    <!-- 3. Here we are checking any mention user @username -->
    var metions = "";
    const postArr = data.content.split(" ");
    for (let i = 0; i < postArr.length; i++) {
      if (postArr[i].includes("@")) {
        metions = postArr[i].replace("@", "").replace("[", "").replace("]", "");
      }
    }

    <!-- 4. if file is undefined then that means request does not have any imae file -->
    if (!file) {

      <!-- 5. Initalize Aerospike batchType-->
      const batchType = Aerospike.batchType;

      <!-- 6. Initalize Client -->
      const client = await getAerospikeClient();

      const oldString = data.content
        .trim()
        .replace(/(\r\n|\n|\r|(  ))/gm, " ")
        .split(" ");
      const newString = removeStopwords(oldString, eng);
      const post_content = data.content ? data.content : "";
      const post_gif = data.gif ? data.gif : "";


      <!-- 7. Creating key for my posy -->
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
        user.handleUn
      );

      <!-- 8. Initialize batch policy -->
      let batchPolicy1 = new Aerospike.BatchPolicy({});

      // **** Here we generate keys for TRENDING post
      let trending_key = [];
      var batchArrKeys = [];

      <!-- 9. Making key for trending post -->
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

      <!-- 10. Here we generate keys for SEARCHING post -->
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

      <!-- 11. Inserting all the keys inside batch array -->
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

      <!-- 12. Batch write operation start here -->
      for (let i = 0; i < batchArrKeys.length; i++) {

        // *** Feed post
        if (batchArrKeys[i].set === process.env.SET_POSTS) {
          batchRecords.push({
            type: batchType.BATCH_WRITE,
            key: batchArrKeys[i],
            ops: [
              // ** user post list id
              Aerospike.operations.write("id", post_id),
              // ** Post content
              Aerospike.operations.write("content", post_content),
              // ** post gif
              Aerospike.operations.write("gif", post_gif || ""),
              // ** Post like count
              Aerospike.operations.write("l_c", 0),
              // ** Post pinned
              Aerospike.operations.write("pinned", 0),
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


              Aerospike.operations.write("image", req.file ? publicURL : ""),
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
        const user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          user.handleUn
        );
        const user_ops = [Aerospike.operations.incr("post_c", 1)];
        const user_postCount = await client.operate(user_key, user_ops);
        try {
          if (!metions.trim()) {
            var getPostData = await client.get(post_key);
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
    }




    ///pperation with image attached
    if(image){
      const image = 0000;
    }else{
      const image =
    }

    else {
      console.log("IMAGE FILE");
      const publicURL = await uploadImage(file);


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
      // *** Poct comment table
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
        // *** Feed post
        if (batchArrKeys[i].set === process.env.SET_POSTS) {
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
              Aerospike.operations.write("image", publicURL),
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
              Aerospike.operations.write("image", publicURL),
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
        const user_key = new Aerospike.Key(
          process.env.CLUSTER_NAME,
          process.env.SET_USERS,
          user.handleUn
        );
        const user_ops = [Aerospike.operations.incr("post_c", 1)];
        const user_postCount = await client.operate(user_key, user_ops);
        try {
          if (!metions.trim()) {
            var getPostData = await client.get(post_key);
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
    }

}
