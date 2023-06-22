/** @format */

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  var searchObj = {
    userTo: req.user._id,
    notificationType: { $ne: "newMessage" },
  };

  if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
    searchObj.opened = false;
  }

  Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get("/latest", async (req, res, next) => {
  Notification.findOne({ userTo: req.user._id })
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then((results) => res.status(200).json(results))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.put("/:id/markAsOpened", async (req, res, next) => {
  Notification.findByIdAndUpdate(req.params.id, { opened: true }, { new: true })
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.put("/markAsOpened", async (req, res, next) => {
  Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
    .then(() => res.sendStatus(204))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
