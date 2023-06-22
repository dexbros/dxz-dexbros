/** @format */

const express = require("express");
const app = express();
const port = process.env.PORT || 3200;
const middleware = require("./middleware/auth");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const Aerospike = require("aerospike");
const { defineAerospikeClient, getAerospikeClient } = require("./aerospike");
const axios = require("axios");
const batchType = Aerospike.batchType;
const fs = require("fs");
var createError = require("http-errors");

const { saveCryptoList, cryptoData } = require("./ExternalApis/cryptoApi");

const server = app.listen(port, async () => {
  console.log("Server listening on port " + port + "...");
  const config = await getAerospikeClient();
  // cryptoData();
  // fetchCryptoList();
  // startConsumer(async () => {
  //   console.log("SUCCESS FROM KAFAK **********");
  // }).catch(console.error);
});

// ***********
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-social-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

server.setTimeout(0);

app.use(cors());

const io = require("socket.io")(server, {
  transports: ["websocket"],
  pingTimeout: 360000,
  cors: {
    origin: "http://localhost:3002",
  },
});

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   fileupload({
//     useTempFiles: true,
//   })
// );
app.use(
  session({
    secret: "mytopsecretsession",
    resave: true,
    saveUninitialized: false,
  })
);

// Routes
const loginRoute = require("./routes/loginRoutes");
const logoutRoute = require("./routes/logout");
const registerRoute = require("./routes/registerRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const profileRoute = require("./routes/profileRoutes");

// Api routes
// *** *** //
const postsApiRoute = require("./routes/api/front/duplicatePosts"); // duplicate to post
const usersApiRoute = require("./routes/api/front/users");
const chatsApiRoute = require("./routes/api/front/chats");
const messagesApiRoute = require("./routes/api/front/messages");
const notificationsApiRoute = require("./routes/api/front/notification");
const GROUPApiRoute = require("./routes/api/front/Group/Group");
const GROUPPostApiRoute = require("./routes/api/front/Group/GroupPost");
const blockCastRoute = require("./routes/api/front/BlockCast/BlockCast");
const { getUserForOtherWebsite } = require("./controller/WebsiteController");
const socketInit = require("./socket");

app.get("/", (req, res) => {
  res.send("Opened");
});
app.use("/login", loginRoute);
app.use("/api/logout", middleware.requireLogin, logoutRoute);
app.use("/register", registerRoute);
app.use("/uploads", uploadRoute);
app.use("/profile", profileRoute);

app.use("/api/posts", middleware.requireLogin, postsApiRoute);
app.use("/api/users", middleware.requireLogin, usersApiRoute);
// Group route
app.use("/api/group", middleware.requireLogin, GROUPApiRoute);
app.use("/api/group/post", middleware.requireLogin, GROUPPostApiRoute);

app.use("/api/chats", middleware.requireLogin, chatsApiRoute);
app.use("/api/messages", middleware.requireLogin, messagesApiRoute);
app.use("/api", require("./routes/api/MiscRoute/MiscRoute"));
app.use("/api/notifications", middleware.requireLogin, notificationsApiRoute);

app.use("/api/blockcast", middleware.requireLogin, blockCastRoute);

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(504);
});

// Fetch user details for other website
app.post("/fetch/user", async (req, res) => {
  console.log("API call", req.body.un);
  const client = await getAerospikeClient();

  let { un, type } = req.body;
  console.log(req.body);

  if (!un) {
    return res.status(401).json({ msg: "Invalid request" });
  } else {
    un = un.toString().replaceAll(" ", "+");

    const data = type ? decryptData(un) : un;

    //console.log(data);

    const result = await getUserForOtherWebsite(data);
    return res.status(200).json(result);
  }
});

// *** Share reels in social site
// app.post("/share/reels", async (req, res) => {
//   try {
//     console.log("** share api call **");
//     console.log(req.body);
//   } catch (error) {
//     next(error);
//   }
// });

/**
 * This code block should be below of all routes
 */

// If route not found
app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});

// Error message
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

io.on("connection", (socket) => {
  console.log("Socket Connected....");
  socketInit(socket);
});

const consumer = kafka.consumer({ groupId: "post-metadata-updates" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "post-updates", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Message Consumer: ", JSON.parse(message.value.toString()));
      // const postUpdates = JSON.parse(message.value.toString());
      // console.log("Consumer getting data: ", postUpdates);
      // postUpdates.forEach((update) => {
      //   // Handle each post update
      //   console.log(
      //     `Received update for post ${update.postId}: ${update.postLikeCount} likes`
      //   );
      // });
    },
  });
};

// const result = startConsumer().catch(console.error);
console.log(">>>> From kafka");
