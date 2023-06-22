/** @format */

function socketInit(socket) {
  socket.on("setup", (userData) => {
    console.log(userData);
    console.log("SSocket connected ", userData.handleUn);
    socket.join(userData.handleUn);
    socket.emit("connected");
  });

  socket.on("join room", (room) => {
    socket.join(room);
    //console.log("Joined room " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("notification recieved", (room) =>
    socket.in(room).emit("notification recieved")
  );

  socket.on("new message", (newMessage) => {
    newMessage = JSON.parse(newMessage);
    var chat = newMessage.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;
      socket.in(user._id).emit("message recieved", JSON.stringify(newMessage));
    });
  });

  socket.on("new comment", (newComment) => {
    newComment = JSON.parse(newComment);
    var chat = newComment.chat;

    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newComment.sender._id) return;
      socket.in(user._id).emit("comment recieved", JSON.stringify(newComment));
    });
  });

  // **** Block cast socket code:
  // Joining a block chat
  socket.on("join block", (blockId) => {
    socket.join(blockId);
    console.log("User join the blockcast", blockId);
  });

  // Send message to block
  socket.on("block message", (newMessage) => {
    var chat = newMessage.chatId;
    // console.log(newMessage)
    if (!newMessage.m_u_dun) {
      console.log("No display username found");
    } else {
      socket.in(newMessage.chatId).emit("block message received", newMessage);
      // console.log(newMessage)
    }
  });

  // Send message to block
  socket.on("block comment", (newMessage) => {
    var chat = newMessage.chatId;
    console.log(newMessage);
    if (!newMessage.c_u_dun) {
      console.log("No display username found");
    } else {
      socket.in(newMessage.chatId).emit("block comment received", newMessage);
      console.log(newMessage);
    }
  });

  // *** Delete block message
  socket.on("delete message", (message) => {
    if (message.chatId) {
      // console.log(message);
      socket.in(message.chatId).emit("delete block message", message);
    } else {
      console.log("Message does not have chat id");
      return;
    }
  });

  // *** Typing indicator
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  // *** Stop typing indicator
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("like post", (data) => {
    console.log("Like post: ", data);
    socket
      .in(data.notiData.bins.n_id)
      .emit("like notification", data.notiData.bins);
  });

  socket.on("feed_post", (data) => {
    socket.broadcast.emit("feed", data);
  });

  // **** Notifications
  socket.on("notification receive", (data) => {
    console.log("Notification received: ", data.notificationData.re);
    socket.in(data.notificationData.re).emit("new notification receive", data);
  });
}

module.exports = socketInit;
