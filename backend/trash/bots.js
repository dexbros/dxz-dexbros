/** @format */

const Aerospike = require("aerospike");
const { getAerospikeClient } = require("../aerospike");
var randomWords = require("random-words");
const now = require("nano-time");

const getUsers = async () => {
  const client = await getAerospikeClient();
  var query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);

  // query.where(Aerospike.filter.equal("u_dun", handleUn));
  const queryPolicy = new Aerospike.QueryPolicy();

  // queryPolicy.filterExpression = exp.and(
  //   exp.ge(exp.binInt("cc"), exp.int(start)),
  //   exp.lt(exp.binInt("cc"), exp.int(end))
  // );
  var stream = query.foreach();
  const arr = [];

  stream.on("data", async (data) => {
    // console.log(data);
    arr.push(data.bins);
  });

  stream.on("end", async (data) => {
    // console.log("data");
    console.log(arr);
  });
};
// getUsers();

////////////////////////////////////////////////batch write start////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
async function registerUser() {
  const client = await getAerospikeClient();
  //const key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_USERS, handleUsername);
  const batchType = Aerospike.batchType;
  // Create a new batch policy
  let batchPolicy = new Aerospike.BatchPolicy({});

  let keys = [];
  var batchRecords = [];
  var entryCount = 10;
  for (i = 0; i < entryCount; i++) {
    const logUsername = randomWords(); // Username
    const handleUsername = randomWords(); // Handle Username
    const password = "123456"; // password
    const email = `${randomWords()}@test.com`;
    const fullName = randomWords();
    const id = now.micro();
    var pkid = handleUsername[i];
    var newKey = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_USERS,
      handleUsername
    );

    batchRecords.push({
      type: batchType.BATCH_WRITE,
      key: newKey,
      ops: [
        Aerospike.operations.write("handleUn", handleUsername),
        Aerospike.operations.write("logUn", logUsername),
        Aerospike.operations.write("u_id", id),
        Aerospike.operations.write("fn", fullName),
        Aerospike.operations.write("ln", fullName),
        Aerospike.operations.write("email", email),
        Aerospike.operations.write("password", password),
      ],
    });
  }
  await client.batchWrite(batchRecords, batchPolicy);

  // Create the batch write policy
  let batchWritePolicy = new Aerospike.BatchWritePolicy({
    // An example that will always return true
    //filterExpression: exp.gt(exp.int(2), exp.int(1))
  });
  try {
    // var getPostData = await client.get(post_key);
    // console.log(getPostData)
    // return res.status(201).json(getPostData.bins);
    console.log("Finish");
  } catch (error) {
    // return res.status(401).json({ msg: error.message });
    console.log(error);
  }
}
// registerUser();
////////////////////////////////////////////////////////batch write end////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////batch update start////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
async function following() {
  const client = await getAerospikeClient();
  const new_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_USER_META,
    "account_1"
  );
  const user_key = new Aerospike.Key(
    process.env.CLUSTER_NAME,
    process.env.SET_USERS,
    "account_1"
  );
  // const post_key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_USERS, d_u);
  let query = client.query(process.env.CLUSTER_NAME, process.env.SET_USERS);
  const tempBin = "ExpVar"; // this bin is to hold expression read operation output
  query.select(["handleUn"]); //select single bin
  // query.where(Aerospike.filter.equal("p_id", req.params.id));

  // const queryPolicy = new Aerospike.QueryPolicy({});
  let arr = [];
  var i = 0;
  const stream = query.foreach();
  stream.on("data", async function (record) {
    console.log(record.bins.handleUn);
    arr.push(record.bins.handleUn);
    // const ops = [Aerospike.lists.append("flw", record.bins.d_u)];
    // client.operate(new_key, ops, (err, result) => {
    //   // if (err) {
    //   //   console.log(err)
    //   // } else {
    //   //   console.log(result)
    //   // }
    // });
    // // const ops1 = [Aerospike.operations.incr("following_c", 1)];
    // client.operate(user_key, ops1, (err, result) => {
    //   // if (err) {
    //   //   console.log(err)
    //   // } else {
    //   //   console.log(result)
    //   // }
    // });
  });
  stream.on("end", async function (users) {
    console.log(arr.length);
    // const ops = [Aerospike.lists.set("flw", "index", arr)];
    const ops1 = [Aerospike.operations.write("flwr_c", arr.length - 1)];

    client.put(new_key, { flwr: arr }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(result);
        console.log("List operation");
        client
          .operate(user_key, ops1)
          .then((data) => {
            console.log(data);
            console.log("Followers count");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    //  console.log(arr)
    // const data = await client.get(new_key);
    // console.log(data.bins)
    // const ops = [Aerospike.lists.append("followers", arr)];
    // const new_key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_USER_META, "account_nine");
    // client.operate(new_key, ops, (err, result) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(result)
    //   }
    // });
  });
}

// following();

async function generatePosts() {
  for (let i = 0; i < 10; i++) {
    const client = await getAerospikeClient();
    const post_id = now.micro();
    const post_key = new Aerospike.Key(
      process.env.CLUSTER_NAME,
      process.env.SET_POSTS,
      post_id
    );
    // const process.env.SET_POST_META_key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_POST_META, post_id);
    // const user_key = new Aerospike.Key(process.env.CLUSTER_NAME, process.env.SET_USERS, "account_1");

    const post_bins = {
      id: post_id.toString(),
      content:
        "There are many variations of passages of Lorem Ipsum available,",
      gif: "",
      l_c: 0, // Like count
      d_c: 0, // Dislike count
      book: [], // Bookmark
      pinned: 0,
      u_id: "1668771930180201", // User id
      u_fn: "Account", // Post user first name
      u_ln: "Four", // Posted user last name
      u_dun: "account_four", // Post user display username
      u_img: "", // Post user profile image
      hide: [], // hold userId those who hide this post
      s_c: 0, // spam count
      c_t: new Date().getTime().toString(), // Post time
      u_t: new Date().getTime().toString(), // Post update time
      c_c: 0, // Comment count related to the post
      s_c: 0, // Share count..
      is_share: 0,
      is_poll: false,
      // cc: counterData.bins.cc
    };

    // const process.env.SET_POST_META_bins = {
    //   id: post_id.toString(),
    //   likes: [],
    //   heart: [],
    //   haha: [],
    //   party: [],
    //   dislikes: [],
    //   spam: [],
    //   share: [],
    // };

    await client.put(
      process.env.SET_POST_META_key,
      process.env.SET_POST_META_bins
    );
    await client.put(post_key, post_bins);
  }
  console.log("Post save");
}

generatePosts();
