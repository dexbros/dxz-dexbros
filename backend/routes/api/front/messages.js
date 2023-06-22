/** @format */

const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body.content || !req.body.chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: req.body.content,
    chat: req.body.chatId,
  };

  Message.create(newMessage)
    .then(async (message) => {
      message = await User.populate(message, { path: "sender" });
      message = await Chat.populate(message, { path: "chat" });
      message = await User.populate(message, { path: "chat.users" });
      //console.log(message);
      var chat = await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });

      insertNotification(chat, message);

      res.status(201).json(message);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

function insertNotification(chat, message) {
  chat.users.forEach((userId) => {
    if (userId == message.sender._id.toString()) return;

    Notification.insertNotification(
      userId,
      message.sender._id,
      "newMessage",
      message.chat._id
    );
  });
}

module.exports = router;
